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

export type TransformType = {
  id: string;
  functionId?: string;
  type: string;
  value?: string;
  args?: TransformType[];
};

export type IData = {
  key: string;
  name: string;
  transform: TransformType[];
  variableId: string;
  existVariableId: string;
};

export type OptionType = {
  label: string;
  value: string;
  type: string;
};

// @, $, #
// @: Variable list
// $: Built-in function list
// #: Direct value of cell
// directly value
export const VALUE_TYPE = {
  VARIABLE: 'variable',
  FUNCTION: 'function',
  RECORDED_DATA: 'recorded_data',
  DIRECT: 'direct'
};

export const variableOptions: OptionType[] = [
  { label: 'Order Type', value: `orderType`, type: VALUE_TYPE.VARIABLE },
  { label: 'Division', value: `division`, type: VALUE_TYPE.VARIABLE },
  { label: 'Channel', value: `channel`, type: VALUE_TYPE.VARIABLE }
];

export const functionOptions: OptionType[] = [
  {
    label: 'regexValue',
    value: `regexValue`,
    type: VALUE_TYPE.FUNCTION
  }
];
