import { EditableTable, Item } from '@/pages/setting/components/EditableTable';
import TreeView from '@/pages/setting/components/TreeView';
import { Flex } from 'antd';
import { useState } from 'react';

const Setting = () => {
  const [data, setData] = useState<Item[]>([
    { key: '1', name: 'John', age: 25 },
    { key: '2', name: 'Jane', age: 30 }
  ]);
  console.log('🚀 ~ Setting ~ data:', data);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true
    },
    {
      title: 'Age',
      dataIndex: 'age',
      editable: true
    }
  ];

  return (
    <Flex className='setting' style={{ height: '100%' }} vertical gap={16}>
      <h2>Setting</h2>

      <EditableTable
        columns={columns}
        dataSource={data}
        onDataChange={(newData) => setData(newData)}
        pagination={false}
      />

      <div style={{ flex: '1 1 auto' }}>
        <TreeView />
      </div>
    </Flex>
  );
};

export default Setting;
