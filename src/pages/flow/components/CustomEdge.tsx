import useOnClickOutside from '@/core/hooks/useOnClickOutside';
import PopoverPortal from '@/pages/flow/components/PopoverPortal';
import { getBezierPath, type Edge, type EdgeProps } from '@xyflow/react';
import { Button, Flex } from 'antd';
import { useRef, useState, type FC, type MouseEvent } from 'react';

const CustomEdge: FC<EdgeProps<Edge<{ label: string }>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style
}) => {
  const btnGroupRef = useRef<HTMLDivElement>(null);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  // Generate the Bezier path for the edge
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  // Close the popover when clicking outside
  useOnClickOutside(btnGroupRef, () => setIsPopoverVisible(false));

  // Handle click on the edge
  const handleEdgeClick = (event: MouseEvent<SVGPathElement>) => {
    console.log('click', event);

    // Set the popover position to the click coordinates
    setPopoverPosition({
      x: event.pageX,
      y: event.pageY
    });

    // Open the popover
    setIsPopoverVisible(true);
  };

  return (
    <>
      {/* Edge path */}
      <path
        id={id}
        className='react-flow__edge-path'
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
        onClick={handleEdgeClick}
      />

      {/* Popover portal */}
      <PopoverPortal visible={isPopoverVisible}>
        <Flex
          ref={btnGroupRef}
          className='absolute p-2 rounded bg-slate-200'
          style={{
            transform: `translate(-50%, -50%) translate(${popoverPosition.x}px,${popoverPosition.y}px)`
          }}
          gap={8}
        >
          <Button className='w-[80px]' type='primary'>
            Single
          </Button>
          <Button className='w-[80px]' type='primary'>
            Multiple
          </Button>
        </Flex>
      </PopoverPortal>
    </>
  );
};

export default CustomEdge;
