import { TreeNode } from '@/common/types/tree';

export const treeData: TreeNode[] = [
  {
    title: '0-0',
    id: '0-0',
    type: 'folder',
    children: [
      {
        title: '0-0-0',
        id: '0-0-0',
        type: 'folder',
        children: [
          { title: '0-0-0-0', id: '0-0-0-0', type: 'folder' },
          { title: '0-0-0-1', id: '0-0-0-1', type: 'file' },
          { title: '0-0-0-2', id: '0-0-0-2', type: 'file' }
        ]
      },
      {
        title: '0-0-1',
        id: '0-0-1',
        type: 'folder',
        children: [
          { title: '0-0-1-0', id: '0-0-1-0', type: 'file' },
          { title: '0-0-1-1', id: '0-0-1-1', type: 'folder' },
          { title: '0-0-1-2', id: '0-0-1-2', type: 'folder' }
        ]
      },
      {
        title: '0-0-2',
        id: '0-0-2',
        type: 'folder'
      }
    ]
  },
  {
    title: '0-1',
    id: '0-1',
    type: 'folder',
    children: [
      { title: '0-1-0-0', id: '0-1-0-0', type: 'folder' },
      { title: '0-1-0-1', id: '0-1-0-1', type: 'file' },
      { title: '0-1-0-2', id: '0-1-0-2', type: 'file' }
    ]
  },
  {
    title: '0-2',
    id: '0-2',
    type: 'folder'
  }
];
