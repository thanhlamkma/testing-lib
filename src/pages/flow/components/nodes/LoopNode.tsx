import SettingNode from '@/pages/flow/components/nodes/SettingNode';
import { useWorkflow } from '@/pages/flow/provider/useWorkflow';
import { CloseOutlined } from '@ant-design/icons';
import { Node, NodeProps, NodeResizer, useReactFlow } from '@xyflow/react';
import { Flex, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';

export type LoopNodeProps = Node<{ label: string } & Record<string, unknown>>;

const LoopNode = (node: NodeProps<LoopNodeProps>) => {
  const { id, data, selected } = node;

  const { deleteElements, updateNode } = useReactFlow();
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
      <NodeResizer isVisible={selected} minWidth={240} minHeight={160} />

      <Flex
        className='relative p-4 rounded'
        align='center'
        justify='center'
        onClick={() => setIsOpen(true)}
      >
        <Flex
          className='fixed h-6 p-2 rounded-sm -top-3 left-3 bg-neutral-200'
          align='center'
          justify='center'
          gap={8}
        >
          <CloseOutlined className='cursor-pointer' onClick={onDelNode} />
          <span>Loop Node</span>
        </Flex>

        {data.label}
      </Flex>

      <SettingNode title='Loop' open={isOpen} onClose={onCloseSetting}>
        <Form className='px-4 pb-4' labelCol={{ span: 4 }} labelAlign='left' colon={false}>
          <Form.Item label='Node Name' name='name'>
            <Input />
          </Form.Item>

          <Form.Item label='Test Data' name='testDataId'>
            <Select />
          </Form.Item>
        </Form>
      </SettingNode>
    </>
  );
};

export default LoopNode;
