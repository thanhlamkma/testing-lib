import { PlusOutlined } from '@ant-design/icons';
import { Handle, Position } from '@xyflow/react';
import { Dropdown, MenuProps } from 'antd';

const NodeAdd = () => {
  const items: MenuProps['items'] = [
    {
      key: 'node',
      label: 'Node'
    },
    {
      key: 'loop',
      label: 'Loop'
    }
  ];

  const onClickNodeType: MenuProps['onClick'] = (info) => {
    console.log('🚀 ~ onSelectNodeType ~ info:', info);
  };

  return (
    <>
      <Handle
        type='target'
        position={Position.Left}
        style={{ border: 'none', background: 'transparent' }}
      />

      <Dropdown
        menu={{ items, onClick: onClickNodeType }}
        placement='bottomCenter'
        arrow={{ pointAtCenter: true }}
        trigger={['click']}
      >
        <div className='flex items-center justify-center w-10 h-10 text-xl rounded'>
          <PlusOutlined />
        </div>
      </Dropdown>
    </>
  );
};

export default NodeAdd;
