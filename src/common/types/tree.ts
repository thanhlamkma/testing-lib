export interface TreeNode {
  id: string;
  title: string;
  type: string;
  children?: TreeNode[];
}

export type TreePath = (string | number)[];

export enum TreePosEnum {
  ON = 'on',
  BEFORE = 'before',
  AFTER = 'after'
}

export enum TreeTypeEnum {
  FOLDER = 'folder',
  FILE = 'file'
}
