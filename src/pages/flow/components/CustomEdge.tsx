import useOnClickOutside from '@/core/hooks/useOnClickOutside';
import PopoverPortal from '@/pages/flow/components/PopoverPortal';
import { useWorkflow } from '@/pages/flow/provider/useWorkflow';
import { getBezierPath, type Edge, type EdgeProps } from '@xyflow/react';
import { Button, Flex } from 'antd';
import clsx from 'clsx';
import { useRef, useState, type FC } from 'react';

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
  const { selectedEdges, setSelectedEdges } = useWorkflow();
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
  useOnClickOutside(btnGroupRef, () => {
    setIsPopoverVisible(false);
  });

  // Handle click on the edge
  const handleEdgeClick = () => {
    // console.log('click', event);
    if (selectedEdges.includes(id)) {
      setSelectedEdges(selectedEdges.filter((e) => e !== id));
    } else {
      setSelectedEdges([...selectedEdges, id]);
    }
  };

  // Handle right-click event
  const handlePathRightClick = (event: React.MouseEvent<SVGPathElement>) => {
    event.preventDefault(); // Prevent the default context menu

    setPopoverPosition({
      x: event.clientX,
      y: event.clientY
    });

    // Open the popover
    setIsPopoverVisible(true);

    // Add your custom logic here
    console.log('Right-clicked on path at:', event.clientX, event.clientY);
  };

  const onSingleClick = () => {
    console.log('single click', id);
  };

  const onMultipleClick = () => {
    console.log('selected', selectedEdges);
  };

  // useEffect(() => {
  //   const edgeEl = document.querySelector(`[data-id='${id}']`);
  //   if (selectedEdges.includes(id)) {
  //     edgeEl?.classList.add('selectttt');
  //   } else {
  //     edgeEl?.classList.remove('selectttt');
  //   }
  // }, [selectedEdges, id]);

  return (
    <>
      {/* Edge path */}
      <path
        id={id}
        className={clsx('react-flow__edge-path', selectedEdges.includes(id) ? 'selectttt' : '')}
        d={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, stroke: '#b1b1b7' }}
      />

      <path
        id={id}
        className={clsx('react-flow__edge-interaction')}
        d={edgePath}
        fill='none'
        strokeOpacity={0}
        strokeWidth={20}
        onClick={handleEdgeClick}
        onContextMenu={handlePathRightClick}
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
          <Button className='w-[80px]' type='primary' onClick={onSingleClick}>
            Single
          </Button>
          {selectedEdges.length > 1 && (
            <Button className='w-[80px]' type='primary' onClick={onMultipleClick}>
              Multiple
            </Button>
          )}
        </Flex>
      </PopoverPortal>
    </>
  );
};

export default CustomEdge;
