import TreeDnd from '@/common/components/treeDnd/TreeDnd';
import { Flex } from 'antd';

const Setting = () => {
  return (
    <Flex className='setting' style={{ height: '100%' }} vertical>
      <h2>Setting</h2>

      <div style={{ flex: '1 1 auto' }}>
        <TreeDnd />
      </div>
    </Flex>
  );
};

export default Setting;
