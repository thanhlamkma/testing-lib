import SettingNode from '@/pages/flow/components/nodes/SettingNode';
import { useWorkflow } from '@/pages/flow/provider/useWorkflow';
import { CloseOutlined } from '@ant-design/icons';
import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';

export type CustomNodeProps = Node<{ label: string } & Record<string, unknown>>;

const CustomNode = (node: NodeProps<CustomNodeProps>) => {
  const { id, selected, data } = node;

  const { updateNode, deleteElements } = useReactFlow();
  const { selectedNode } = useWorkflow();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onDelNode = () => {
    deleteElements({
      nodes: [{ id }]
    });
  };

  const onCloseSetting = () => {
    setIsOpen(false);
    updateNode(id, {
      ...node,
      selected: false
    });
  };

  useEffect(() => {
    setIsOpen(Boolean(selectedNode?.id === id && selected));
  }, [selectedNode, selected, id]);

  return (
    <>
      <Handle id='custom-source-left' type='source' position={Position.Left} />
      <Flex className='relative bg-transparent w-[200px] h-[60px]' align='center' justify='center'>
        <CloseOutlined className='absolute cursor-pointer -top-1 right-2' onClick={onDelNode} />
        {data.label}
      </Flex>

      <SettingNode title='Custom Node' open={isOpen} onClose={onCloseSetting}>
        <Flex className='px-4 pb-4'>Setting for {data.label}</Flex>
      </SettingNode>
      <Handle id='custom-source-right' type='source' position={Position.Right} />

      {/* <CustomHandle id='b' type='source' position={Position.Right} onAddNode={onAddNode} /> */}
    </>
  );
};

export default CustomNode;
