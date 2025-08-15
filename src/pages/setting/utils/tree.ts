import type { DataNode } from 'antd/es/tree';

/**
 * Search folders by title (case-insensitive, partial match)
 * @param tree - the tree data to search
 * @param keyword - the title keyword to match
 * @returns filtered tree containing only matched folders (with structure preserved)
 */
export function searchFoldersByTitle(tree: DataNode[], keyword: string): DataNode[] {
  const lowerKeyword = keyword.toLowerCase();

  function filterNode(node: DataNode): DataNode | null {
    const isFolder = !node.isLeaf;

    // Recursively search in children
    const filteredChildren = node.children?.map(filterNode).filter(Boolean) as
      | DataNode[]
      | undefined;

    const match = isFolder && node.title?.toString().toLowerCase().includes(lowerKeyword);

    if (match || (filteredChildren && filteredChildren.length > 0)) {
      return {
        ...node,
        children: filteredChildren
      };
    }

    return null;
  }

  return tree.map(filterNode).filter(Boolean) as DataNode[];
}
