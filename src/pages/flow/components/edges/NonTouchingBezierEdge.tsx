import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  useReactFlow
} from '@xyflow/react';
import React, { useMemo } from 'react';

const NonTouchBezierEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
  data
}: EdgeProps) => {
  const { getNode } = useReactFlow();

  const path = useMemo(() => {
    const sourceNode = getNode(source);
    // console.log('🚀 ~ NonTouchBezierEdge ~ sourceNode:', sourceNode);
    const targetNode = getNode(target);
    // console.log('🚀 ~ NonTouchBezierEdge ~ targetNode:', targetNode);

    if (!sourceNode || !targetNode) return '';

    if (targetNode.position.x > sourceNode.position.x + (sourceNode.measured?.width ?? 0)) {
      return getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
      })[0];
    }

    if (
      targetNode.position.x < sourceNode.position.x + (sourceNode.measured?.width ?? 0) &&
      targetNode.position.y + (targetNode.measured?.height ?? 0) >= sourceNode.position.y &&
      targetNode.position.y <= sourceNode.position.y + (sourceNode.measured?.height ?? 0)
    ) {
      return '';
    }

    return getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 16
    })[0];
  }, [source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, getNode]);

  return (
    <>
      {/* 2️⃣ Vẽ path chính */}
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#007bff' : '#333',
          strokeWidth: selected ? 2.5 : 1.5,
          pointerEvents: 'none' // tránh block node
        }}
      />

      {/* 3️⃣ Optional: vẽ overlay để dễ click chọn edge */}
      <path
        d={path}
        strokeOpacity={0}
        strokeWidth={10}
        fill='none'
        className='react-flow__edge-interaction'
      />

      {/* 4️⃣ Optional label (test/debug) */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px, ${
                (sourceY + targetY) / 2
              }px)`,
              pointerEvents: 'all',
              background: 'white',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              border: '1px solid #ccc'
            }}
          >
            {data?.label as unknown as React.ReactNode}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default NonTouchBezierEdge;
