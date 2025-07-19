/* eslint-disable @typescript-eslint/no-explicit-any */
import { TreeNode, TreePath, TreePosEnum } from '@/common/types/tree';

export const isDescendant = (node: TreeNode, targetId: string): boolean => {
  if (node.id === targetId) return true;
  return node.children?.some((child) => isDescendant(child, targetId)) ?? false;
};

export const findNode = (tree: TreeNode[], id: string): TreeNode | undefined => {
  for (const node of tree) {
    if (node.id === id) return node;
    const found = findNode(node?.children ?? [], id);
    if (found) return found;
  }
  return undefined;
};

export const isValidDrop = (tree: TreeNode[], draggedId: string, dropTargetId: string): boolean => {
  if (draggedId === dropTargetId) return false;

  const draggedNode = findNode(tree, draggedId);
  const dropTargetNode = findNode(tree, dropTargetId);

  if (!draggedNode || !dropTargetNode) return false;

  return !isDescendant(draggedNode, dropTargetId);
};

export const moveTree = (tree: TreeNode[], fromPath: TreePath, toPath: TreePath): TreeNode[] => {
  const getAt = (tree: any[], path: TreePath): any => {
    return path.reduce((acc: any, key) => acc?.[key], tree);
  };

  const cloneTree = structuredClone(tree); // deep clone tree

  const fromParent: any[] = getAt(cloneTree, fromPath.slice(0, -1));
  const fromIndex = fromPath[fromPath.length - 1] as number;
  const [movedNode] = fromParent.splice(fromIndex, 1);

  const toParent: any[] = getAt(cloneTree, toPath.slice(0, -1));
  const toIndex = toPath[toPath.length - 1] as number;
  toParent.splice(toIndex, 0, movedNode);

  return cloneTree;
};

export const moveTreeV2 = (
  tree: TreeNode[],
  fromId: string,
  toId: string,
  position: string
): TreeNode[] => {
  const cloneTree = structuredClone(tree);

  let draggedNode: TreeNode | null = null;

  // Remove node
  const removeNode = (nodes: TreeNode[]): boolean => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === fromId) {
        draggedNode = nodes.splice(i, 1)[0];
        return true;
      }

      if (nodes[i].children && removeNode(nodes[i].children!)) return true;
    }

    return false;
  };

  // Insert node
  const insertNode = (nodes: TreeNode[]): boolean => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === toId) {
        switch (position) {
          case TreePosEnum.ON:
            if (!nodes[i].children) nodes[i].children = [];
            nodes[i].children?.push(draggedNode!);
            break;
          case TreePosEnum.BEFORE:
            nodes.splice(i, 0, draggedNode!);
            break;
          case TreePosEnum.AFTER:
            nodes.splice(i + 1, 0, draggedNode!);
            break;
          default:
            break;
        }

        return true;
      }

      if (nodes[i].children && insertNode(nodes[i].children!)) return true;
    }

    return false;
  };

  removeNode(cloneTree);
  insertNode(cloneTree);

  return cloneTree;
};
