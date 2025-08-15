import type { DataNode } from 'antd/es/tree';

interface SearchResult {
  matchedKeys: string[];
  filteredTree: DataNode[];
}

/**
 * Search folders by title and highlight matched nodes (case-insensitive)
 * - Only folder (not file)
 * - Return filtered tree + matched keys (for auto expand or highlight)
 */
export function searchAndHighlightFolders(tree: DataNode[], keyword: string): SearchResult {
  const lowerKeyword = keyword.toLowerCase();
  const matchedKeys: string[] = [];

  function processNode(node: DataNode): DataNode | null {
    const isFolder = !node.isLeaf;

    const children = node.children?.map(processNode).filter(Boolean) as DataNode[] | undefined;

    const isMatch = isFolder && node.title?.toString().toLowerCase().includes(lowerKeyword);

    if (isMatch) matchedKeys.push(node.key.toString());

    if (isMatch || (children && children.length > 0)) {
      return {
        ...node,
        title: highlightText(node.title?.toString() ?? '', keyword),
        children
      };
    }

    return null;
  }

  return {
    matchedKeys,
    filteredTree: tree.map(processNode).filter(Boolean) as DataNode[]
  };
}

/**
 * Highlight matched text
 */
function highlightText(text: string, keyword: string): React.ReactNode {
  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={i} style={{ backgroundColor: 'yellow' }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
