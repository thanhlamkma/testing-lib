import { TreeNode, TreePosEnum, TreeTypeEnum } from '@/common/types/tree';
import { FileExcelOutlined, FolderOutlined } from '@ant-design/icons';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Flex } from 'antd';
import { CSSProperties, MouseEvent } from 'react';

interface DraggableNodeProps {
  node: TreeNode;
  expandedNodes: Set<string>;
  depth: number;
  toggleExpand: (id: string) => void;
  isLast?: boolean;
  selectedId?: string | null;
  selectNode?: (node: TreeNode) => void;
}

const DraggableNode = ({
  node,
  expandedNodes,
  depth,
  toggleExpand,
  isLast,
  selectedId,
  selectNode
}: DraggableNodeProps) => {
  const { id, type, title, children } = node;
  const isExpanded = expandedNodes.has(id);
  const hasChildren = !!children?.length;
  const className = `node-${type}`;

  const {
    setNodeRef: setDragRef,
    listeners,
    attributes,
    isDragging,
    transform
  } = useDraggable({ id });

  // Drop zone handlers
  const dropZones = {
    label: useDroppable({
      id: `${id}-${TreePosEnum.ON}`,
      data: { nodeId: id, position: TreePosEnum.ON }
    }),
    before: useDroppable({
      id: `${id}-${TreePosEnum.BEFORE}`,
      data: { nodeId: id, position: TreePosEnum.BEFORE }
    }),
    after: useDroppable({
      id: `${id}-${TreePosEnum.AFTER}`,
      data: { nodeId: id, position: TreePosEnum.AFTER }
    })
  };

  const labelStyle: CSSProperties = {
    height: 40,
    marginLeft: `${depth * 20}px`,
    padding: '4px 8px',
    border: '1px solid #ccc',
    background: dropZones.label.isOver ? '#c8e6c9' : selectedId === node.id ? '#e3f2fd' : 'white',
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    transform: isDragging ? `translate(${transform?.x}px, ${transform?.y}px)` : 'none'
  };

  const dropZoneStyle = (isOver: boolean): CSSProperties => ({
    height: 2,
    background: isOver ? '#0452c7' : 'transparent',
    marginLeft: `${depth * 20}px`
  });

  const handleToggleExpand = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (hasChildren) toggleExpand(id);
  };

  const handleSelectNode = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    selectNode?.(node);
  };

  const renderIcon = (): string => {
    if (node.children?.length) {
      return isExpanded ? '\u25BC' : '\u25B6';
    }

    return '';
  };

  return (
    <div className={className}>
      {/* Drop BEFORE */}
      <div ref={dropZones.before.setNodeRef} style={dropZoneStyle(dropZones.before.isOver)} />

      {/* Label with drop ON */}
      <Flex
        ref={type === TreeTypeEnum.FOLDER ? dropZones.label.setNodeRef : undefined}
        align='center'
        gap={6}
        style={labelStyle}
      >
        <span className='expand-icon' onClick={handleToggleExpand} style={{ cursor: 'pointer' }}>
          {renderIcon()}
        </span>

        <Flex
          align='center'
          gap={4}
          ref={setDragRef}
          {...attributes}
          {...listeners}
          style={{ flex: 1, cursor: 'grab' }}
          onDoubleClick={handleSelectNode}
          // onClick={handleSelectNode}
        >
          {type === TreeTypeEnum.FOLDER ? <FolderOutlined /> : <FileExcelOutlined />}
          <span>{title}</span>
        </Flex>
      </Flex>

      {/* Drop AFTER */}
      {isLast ? (
        <div ref={dropZones.after.setNodeRef} style={dropZoneStyle(dropZones.after.isOver)} />
      ) : (
        <div style={{ height: 2 }} />
      )}

      {/* Render children if expanded */}
      {isExpanded &&
        children?.map((child, idx, arr) => (
          <DraggableNode
            key={child.id}
            node={child}
            depth={depth + 1}
            expandedNodes={expandedNodes}
            toggleExpand={toggleExpand}
            isLast={idx === arr.length - 1}
            selectNode={selectNode}
            selectedId={selectedId}
          />
        ))}
    </div>
  );
};

export default DraggableNode;
