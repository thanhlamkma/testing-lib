import { searchAndHighlightFolders } from '@/pages/setting/components/HighlightFolder';
import type { TreeDataNode, TreeProps } from 'antd';
import { Flex, Input, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useState } from 'react';

const defaultData: TreeDataNode[] = [
  {
    title: 'Documents',
    key: '0',
    children: [
      {
        title: 'Projects',
        key: '0-0',
        children: [
          {
            title: 'Project-A',
            key: '0-0-0',
            children: [
              {
                title: 'README.md',
                key: '0-0-0-0',
                isLeaf: true
              },
              {
                title: 'Design.pdf',
                key: '0-0-0-1',
                isLeaf: true
              }
            ]
          },
          {
            title: 'Project-B',
            key: '0-0-1',
            children: []
          }
        ]
      },
      {
        title: 'Notes.txt',
        key: '0-1',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Pictures',
    key: '1',
    children: [
      {
        title: 'Vacation',
        key: '1-0',
        children: [
          {
            title: 'beach.png',
            key: '1-0-0',
            isLeaf: true
          },
          {
            title: 'mountain.jpg',
            key: '1-0-1',
            isLeaf: true
          }
        ]
      }
    ]
  },
  {
    title: 'todo.md',
    key: '2',
    isLeaf: true
  }
];
const { DirectoryTree } = Tree;

const App: React.FC = () => {
  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    console.log(info);
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  };

  const [treeData, setTreeData] = useState<DataNode[]>(defaultData);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState('');

  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

    const loop = (
      data: TreeDataNode[],
      key: React.Key,
      callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj: TreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
      });
    } else {
      let ar: TreeDataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        // Drop on the top of the drop node
        ar.splice(i!, 0, dragObj!);
      } else {
        // Drop on the bottom of the drop node
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setTreeData(data);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearch(keyword);

    if (!keyword) {
      setTreeData(defaultData);
      setExpandedKeys([]);
      return;
    }

    const { filteredTree, matchedKeys } = searchAndHighlightFolders(defaultData, keyword);
    setTreeData(filteredTree);
    setExpandedKeys(matchedKeys);
  };

  return (
    <Flex vertical gap={16}>
      <Input value={search} onChange={handleSearch} />
      <DirectoryTree
        className='draggable-tree'
        defaultExpandedKeys={expandedKeys}
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={treeData}
      />
    </Flex>
  );
};

export default App;
