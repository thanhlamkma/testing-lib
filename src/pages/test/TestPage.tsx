import CommCard from '@/common/components/CommCard';
import { downloadExcel, TableDataType } from '@/pages/test/utils/downloadExcel';
import { Button } from 'antd';
import { useState } from 'react';

const TestPage = () => {
  const data = useState([
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 }
  ]);

  const treeData = useState([
    {
      name: 'Main Category',
      children: [
        {
          name: 'Subcategory A',
          children: [
            {
              name: 'Product 1',
              price: 19.99,
              description: 'A great product'
            },
            {
              name: 'Product 2',
              price: 29.99,
              description: 'Another great product'
            }
          ]
        },
        {
          name: 'Subcategory B',
          children: [
            {
              name: 'Product 3',
              price: 15.99,
              description: 'A cheap product'
            },
            {
              name: 'Product 4',
              price: 39.99,
              description: 'A premium product'
            },
            {
              name: 'Subcategory C',
              children: [
                {
                  name: 'Product 5',
                  price: 10.99,
                  description: 'A basic product'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Second Category'
    }
  ]);

  const handleDownload = () => {
    downloadExcel(
      {
        status: 'active'
      },
      ['Category name', 'Price of cate', 'Category description'],
      treeData[0],
      TableDataType.TREE
    );
  };

  return (
    <CommCard>
      <Button type='primary' onClick={handleDownload}>
        Download Excel
      </Button>
    </CommCard>
  );
};

export default TestPage;
