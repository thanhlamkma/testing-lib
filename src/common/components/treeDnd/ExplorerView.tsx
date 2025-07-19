import DraggableNode from '@/common/components/treeDnd/DraggableNode';
import { TreeNode } from '@/common/types/tree';
import { Flex } from 'antd';

interface ExplorerViewProps {
  data: TreeNode[];
  selectedId?: string;
  onNodeClick?: (node: TreeNode) => void;
  expandedNodes: Set<string>;
  toggleExpand: (id: string) => void;
}

const ExplorerView = ({
  data,
  selectedId,
  onNodeClick,
  expandedNodes,
  toggleExpand
}: ExplorerViewProps) => {
  return (
    <Flex className='data-list' vertical flex={1}>
      {data.map((node, idx, arr) => (
        <DraggableNode
          key={node.id}
          node={node}
          depth={0}
          isLast={idx === arr.length - 1}
          expandedNodes={expandedNodes}
          toggleExpand={toggleExpand}
          selectNode={onNodeClick}
          selectedId={selectedId}
        />
      ))}
    </Flex>
  );
};

export default ExplorerView;
