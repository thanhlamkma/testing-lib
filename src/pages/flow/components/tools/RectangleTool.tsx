import { useReactFlow, useStore, type XYPosition } from '@xyflow/react';
import { useRef, useState, type PointerEvent } from 'react';

type NodePoints = [number, number][];
type NodePointObject = Record<string, NodePoints>;

function getPosition(start: XYPosition, end: XYPosition) {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y)
  };
}

function getDimensions(start: XYPosition, end: XYPosition, zoom: number = 1) {
  return {
    width: Math.abs(end.x - start.x) / zoom,
    height: Math.abs(end.y - start.y) / zoom
  };
}

export function RectangleTool() {
  const { getViewport, flowToScreenPosition, setNodes } = useReactFlow();
  const { nodeLookup } = useStore((state) => ({
    width: state.width,
    height: state.height,
    nodeLookup: state.nodeLookup
  }));
  // console.log('🚀 ~ RectangleTool ~ nodeLookup:', nodeLookup);

  const [start, setStart] = useState<XYPosition | null>(null);
  const [end, setEnd] = useState<XYPosition | null>(null);
  const nodePoints = useRef<NodePointObject>({});

  // Utils
  // Tính cross product 2D: (B - A) × (P - A)
  function cross(ax: number, ay: number, bx: number, by: number, px: number, py: number): number {
    return (bx - ax) * (py - ay) - (by - ay) * (px - ax);
  }

  function pointInConvexPolygon(point: [number, number], polygon: NodePoints) {
    const [px, py] = point;
    let sign = null;

    for (let i = 0; i < polygon.length; i++) {
      const [ax, ay] = polygon[i];
      const [bx, by] = polygon[(i + 1) % polygon.length];

      const c = cross(ax, ay, bx, by, px, py);

      if (c !== 0) {
        if (sign === null) {
          sign = c > 0;
        } else if (sign !== c > 0) {
          return false; // khác phía → ngoài polygon
        }
      }
    }
    return true;
  }

  // Kiểm tra hình vuông nhỏ nằm trong hình vuông lớn
  function squareInSquare(small: NodePoints, big: NodePoints) {
    return small.every((pt) => pointInConvexPolygon(pt, big));
  }

  // Actions
  function handlePointerDown(e: PointerEvent) {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    // console.log('🚀 ~ handlePointerDown ~ e:', e);
    setStart({ x: e.pageX, y: e.pageY });

    nodePoints.current = {};
    for (const node of nodeLookup.values()) {
      const { x, y } = node.internals.positionAbsolute;
      const { width = 0, height = 0 } = node.measured;
      const points = [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height]
      ] satisfies NodePoints;
      nodePoints.current[node.id] = points;
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.buttons !== 1 || !start) return;

    const { pageX: endX, pageY: endY } = e;
    const { x: startX, y: startY } = start;

    const zoom = getViewport().zoom;
    const rectX = Math.min(startX, endX);
    const rectY = Math.min(startY, endY);
    const rectW = Math.abs(endX - startX) / zoom;
    const rectH = Math.abs(endY - startY) / zoom;
    // console.log('🚀 ~ handlePointerMove ~ rectX:', rectX, rectY, rectW, rectH);
    const rectPoints = [
      [rectX, rectY],
      [rectX + rectW, rectY],
      [rectX + rectW, rectY + rectH],
      [rectX, rectY + rectH]
    ] satisfies NodePoints;

    const nodesToSelect = new Set<string>();

    for (const [nodeId, points] of Object.entries(nodePoints.current)) {
      const screenNodePoints: NodePoints = [];

      for (const point of points) {
        const { x, y } = flowToScreenPosition({ x: point[0], y: point[1] });
        screenNodePoints.push([x, y]);
      }

      const check = squareInSquare(screenNodePoints, rectPoints);
      console.log('🚀 ~ handlePointerMove ~ check:', check);

      if (check) {
        nodesToSelect.add(nodeId);
      }
    }

    setEnd({ x: e.pageX, y: e.pageY });
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        selected: nodesToSelect.has(node.id)
      }))
    );
  }

  function handlePointerUp() {
    if (!start || !end) return;
    // const position = screenToFlowPosition(getPosition(start, end));
    // console.log('🚀 ~ handlePointerUp ~ position:', position);
    // const dimension = getDimensions(start, end, getViewport().zoom);
    // console.log('🚀 ~ handlePointerUp ~ dimension:', dimension);

    setStart(null);
    setEnd(null);
  }

  const rect =
    start && end
      ? {
          position: getPosition(start, end),
          dimension: getDimensions(start, end)
        }
      : null;

  return (
    <div
      className='nopan nodrag tool-overlay'
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {rect && (
        <div
          className='rectangle-preview'
          style={{
            ...rect.dimension,
            transform: `translate(${rect.position.x - 12}px, ${rect.position.y - 108}px)`,
            border: '2px dashed rgba(0, 89, 220, 0.8)',
            pointerEvents: 'none'
          }}
        ></div>
      )}
    </div>
  );
}
