import SettingNode from '@/pages/flow/components/SettingNode';
import { CloseOutlined } from '@ant-design/icons';
import { Node, NodeProps, NodeResizer, useReactFlow } from '@xyflow/react';
import { Flex } from 'antd';
import { useCallback, useState } from 'react';

export type LoopNodeProps = Node<{ label: string } & Record<string, unknown>>;

const LoopNode = ({ id, data, selected }: NodeProps<LoopNodeProps>) => {
  const { deleteElements } = useReactFlow();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onDelNode = () => {
    deleteElements({
      nodes: [{ id }]
    });
  };

  const onCloseSetting = useCallback(() => {
    setIsOpen(false);
  }, []);

  // const renderSetting = useMemo(() => {
  //   const portalRoot = document.getElementById('flow-page');
  //   return portalRoot
  //     ? createPortal(
  //         <SettingNode
  //           className={classNames(isOpen ? 'enter' : 'exit')}
  //           onClose={() => setIsOpen(false)}
  //         />,
  //         portalRoot
  //       )
  //     : null;
  // }, [isOpen]);

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

      <SettingNode open={isOpen} onClose={onCloseSetting} />

      {/* {renderSetting} */}
    </>
  );
};

export default LoopNode;
