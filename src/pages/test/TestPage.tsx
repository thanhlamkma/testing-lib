/* eslint-disable @typescript-eslint/no-explicit-any */
import CommCard from '@/common/components/CommCard';
import { downExcel } from '@/pages/test/utils/download';
import { downExcelWithSheetJs, SheetDataType } from '@/pages/test/utils/sheetjs';
import { downExcelWithXlsx, TableDataType } from '@/pages/test/utils/xlsx';
import { Button, Flex } from 'antd';
import { useState } from 'react';

const TestPage = () => {
  const data = useState<SheetDataType[]>([
    { id: 1, name: 'Alice', dob: new Date(1999, 1, 2) },
    { id: 2, name: 'Bob', dob: new Date(1999, 2, 3) },
    { id: 3, name: 'Charlie', dob: new Date(1999, 3, 4) }
  ]);

  const searchInputs = [
    {
      name: 'Name',
      key: 'name',
      type: 'text'
    },
    {
      name: 'Delivery',
      key: 'delivery',
      type: 'select',
      option: [
        {
          label: 'Giao hang nhanh',
          value: 'GHN'
        },
        {
          label: 'Giao hang tiet kiem',
          value: 'GHTK'
        }
      ]
    },
    {
      name: 'Type',
      key: 'type',
      type: 'radio',
      option: [
        {
          label: 'New',
          value: 'new'
        },
        {
          label: 'Old',
          value: 'old'
        }
      ]
    }
  ];

  const request = {
    name: 'Iphone 16 Pro Max',
    delivery: 'GHTK',
    type: 'new'
  };

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

  const handleDownloadWithXLSX = () => {
    downExcelWithXlsx(
      {
        status: 'active'
      },
      ['Category name', 'Price of cate', 'Category description'],
      treeData[0],
      TableDataType.TREE
    );
  };

  const handleDownloadWithSheetJs = () => {
    downExcelWithSheetJs(data[0]);
  };

  const handleCustomDownload = () => {
    const conditionData = searchInputs.reduce((acc: any, input) => {
      const reqVal = request[input.key as keyof typeof request];
      if (input.type === 'select' || input.type === 'radio') {
        acc[input.key] = input.option?.find((e) => reqVal === e.value)?.label ?? reqVal;
      } else {
        acc[input.key] = reqVal;
      }
      return acc;
    }, {});

    const condition = {
      headers: searchInputs.map((item) => ({ name: item.name, key: item.key })),
      data: conditionData
    };

    downExcel({
      headers: [
        { header: 'Name', key: 'name' },
        { header: 'Price', key: 'price' },
        { header: 'Description', key: 'description' }
      ],
      data: treeData[0],
      fileName: 'Test download excel',
      type: 'tree',
      condition
    });
  };

  return (
    <CommCard>
      <Flex gap={16}>
        <Button type='primary' onClick={handleDownloadWithXLSX}>
          Download Excel with XLSX
        </Button>

        <Button type='primary' onClick={handleDownloadWithSheetJs}>
          Download Excel with exceljs
        </Button>

        <Button type='primary' onClick={handleCustomDownload}>
          Custom Download
        </Button>
      </Flex>
    </CommCard>
  );
};

export default TestPage;
