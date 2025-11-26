import { Handle, Node, NodeProps, Position } from '@xyflow/react';

type NodeStartEndData = Record<string, unknown> & {
  type: string;
  label: string;
};

type NodeStartEndProps = NodeProps<Node<NodeStartEndData, string>>;

const NodeStartEnd = ({ data }: NodeStartEndProps) => {
  const { type, label } = data;

  const isStart = type === 'start';

  return (
    <>
      {isStart ? (
        <Handle id='start-end-source' type='source' position={Position.Right} />
      ) : (
        <Handle id='start-end-target' type='target' position={Position.Left} />
      )}

      <span className='font-semibold'>{label}</span>
    </>
  );
};

export default NodeStartEnd;
