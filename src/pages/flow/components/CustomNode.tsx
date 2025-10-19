import SettingNode from '@/pages/flow/components/SettingNode';
import { CloseOutlined } from '@ant-design/icons';
import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';

export type CustomNodeProps = Node<{ label: string } & Record<string, unknown>>;

const CustomNode = (node: NodeProps<CustomNodeProps>) => {
  const { id, selected, data } = node;
  const { updateNode, deleteElements } = useReactFlow();
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
    setIsOpen(selected ?? false);
  }, [selected]);

  return (
    <>
      <Flex className='relative w-[200px] h-[60px]' align='center' justify='center'>
        <CloseOutlined className='absolute cursor-pointer -top-1 right-2' onClick={onDelNode} />
        {data.label}
      </Flex>

      <SettingNode title='Custom Node' open={isOpen} onClose={onCloseSetting}>
        <Flex className='px-4 pb-4'>Setting for {data.label}</Flex>
      </SettingNode>
    </>
  );
};

export default CustomNode;
