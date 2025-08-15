import DraggableNode from '@/common/components/treeDnd/DraggableNode';
import { TreeNode } from '@/common/types/tree';
import { findNode, isValidDrop, moveTreeV2 } from '@/common/utils/uTree';
import { treeData as initialTree } from '@/pages/setting/types';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';

const TreeDnd = () => {
  const [tree, setTree] = useState<TreeNode[]>(initialTree);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [data, setData] = useState<TreeNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => {
      const copy = new Set(prev);

      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }

      return copy;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const draggedId = active.id.toString();
    const { nodeId: toId = '', position = '' } = over.data.current ?? {};

    let realDraggedId = draggedId;
    let realToID = toId;

    if (draggedId.includes('@@@')) {
      realDraggedId = draggedId.split('@@@')[1];
    }

    if (toId.includes('@@@')) {
      realToID = toId.split('@@@')[1];
    }

    if (!isValidDrop(tree, realDraggedId, realToID)) return;

    const newTree = moveTreeV2(tree, realDraggedId, realToID, position);
    setTree(newTree);

    return;
  };

  const onSelectNode = (node: TreeNode) => {
    const { id, children } = node;

    setSelectedNodeId(id);

    if (children) {
      setData(children.map((child) => ({ ...child, id: `data@@@${child.id}`, children: [] })));
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    if (!selectedNodeId) return;

    const { children = [] } = findNode(tree, selectedNodeId) ?? {};

    if (children?.length) {
      setData(children.map((child) => ({ ...child, id: `data@@@${child.id}`, children: [] })));
    } else {
      setData([]);
    }
  }, [tree, selectedNodeId]);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Flex gap={48}>
        <Flex className='tree-list' vertical flex={1}>
          {tree.map((node, idx, arr) => (
            <DraggableNode
              key={`tree-${node.id}`}
              node={node}
              depth={0}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
              isLast={idx === arr.length - 1}
              selectedId={selectedNodeId}
              selectNode={onSelectNode}
            />
          ))}
        </Flex>

        <Flex className='data-list' vertical flex={1}>
          {data.map((node, idx, arr) => (
            <DraggableNode
              key={`data-${node.id}`}
              node={node}
              depth={0}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
              isLast={idx === arr.length - 1}
              selectedId={selectedNodeId}
              selectNode={onSelectNode}
            />
          ))}
        </Flex>
      </Flex>
    </DndContext>
  );
};

export default TreeDnd;
