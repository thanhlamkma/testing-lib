import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from '@xyflow/react';
import React from 'react';

const CustomEdge2 = ({
  id,
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
  const path = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16
  })[0];

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

export default CustomEdge2;
