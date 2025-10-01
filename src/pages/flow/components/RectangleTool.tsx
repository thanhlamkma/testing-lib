import { useReactFlow, useStore, type XYPosition } from '@xyflow/react';
import { useState, type PointerEvent } from 'react';

type NodePoints = ([number, number] | [number, number, number])[];
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
  const { screenToFlowPosition, getViewport, flowToScreenPosition, setNodes } = useReactFlow();
  const { nodeLookup } = useStore((state) => ({
    width: state.width,
    height: state.height,
    nodeLookup: state.nodeLookup
  }));
  // console.log('🚀 ~ RectangleTool ~ nodeLookup:', nodeLookup);

  const [start, setStart] = useState<XYPosition | null>(null);
  const [end, setEnd] = useState<XYPosition | null>(null);

  function handlePointerDown(e: PointerEvent) {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    console.log('🚀 ~ handlePointerDown ~ e:', e);
    setStart({ x: e.pageX, y: e.pageY });
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.buttons !== 1 || !start) return;

    const { pageX: endX, pageY: endY } = e;
    const { x: startX, y: startY } = start;

    const rectX = Math.min(startX, endX);
    const rectY = Math.min(startY, endY);
    const rectW = Math.abs(endX - startX);
    const rectH = Math.abs(endY - startY);
    // console.log('🚀 ~ handlePointerMove ~ rectX:', rectX, rectY, rectW, rectH);

    const nodesToSelect = new Set<string>();

    // for (const node of nodeLookup.values()) {
    //   const { x, y } = node.position;
    //   const { width = 0, height = 0 } = node.measured;

    //   if (

    //   )

    // }

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
