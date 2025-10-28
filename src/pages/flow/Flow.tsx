import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  Rect,
  XYPosition,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type EdgeTypes,
  type Node,
  type OnConnect
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MouseEvent, PointerEvent, useCallback, useMemo, useState } from 'react';
import './styles/index.scss';

import { darkThemeStoreState } from '@/common/stores/ThemeStore';
import CustomEdge2 from '@/pages/flow/components/CustomEdge2';
import CustomNode from '@/pages/flow/components/CustomNode';
import LoopNode from '@/pages/flow/components/LoopNode';
import NodeAdd from '@/pages/flow/components/NodeAdd';
import NodeStartEnd from '@/pages/flow/components/NodeStartEnd';
import { OnDropAction, useDnD, useDnDPosition } from '@/pages/flow/provider/useDnd';
import { useWorkflow } from '@/pages/flow/provider/useWorkflow';
import { Flex } from 'antd';
import classNames from 'classnames';
import clsx from 'clsx';
import { useRecoilValue } from 'recoil';
import CustomEdge from './components/CustomEdge';
import CustomEdgeStartEnd from './components/CustomEdgeStartEnd';

let id = 0;
const getNodeId = () => `flow-node-${id++}`;
const getEdgeId = () => `flow-edge-${id++}`;

export interface IUnit {
  id: number;
  key: number;
  type: string;
  data: {
    label: string;
  };
  width: number;
  height: number;
}

const nodeTypes = {
  'loop-node': LoopNode,
  'custom-node': CustomNode,
  'node-add': NodeAdd,
  'node-start-end': NodeStartEnd
};
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
  'start-end': CustomEdgeStartEnd,
  'custom-edge2': CustomEdge2
};

const initialNodes: Node[] = [
  {
    id: getNodeId(),
    type: 'node-start-end',
    position: {
      x: 0,
      y: 0
    },
    width: 100,
    height: 40,
    data: { label: `START`, type: 'start' }
  },
  {
    id: getNodeId(),
    type: 'node-add',
    position: {
      x: 200,
      y: 0
    },
    width: 40,
    height: 40,
    data: { label: '+' }
  }
];

const initialEdges: Edge[] = [
  {
    id: getEdgeId(),
    type: 'custom',
    source: initialNodes[0].id,
    target: initialNodes[1].id,
    markerEnd: {
      type: MarkerType.Arrow
    }
  }
];

const Flow = () => {
  const themeStore = useRecoilValue(darkThemeStoreState);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const { getIntersectingNodes, updateNode } = useReactFlow();
  const { onDragStart, isDragging } = useDnD();
  const { setSelectedNode } = useWorkflow();

  const [createdNode, setCreatedNode] = useState<IUnit | null>(null);

  // Data
  const fakeData: IUnit[] = [
    {
      id: 1,
      key: 1,
      type: 'custom-node',
      data: {
        label: 'Node 1'
      },
      width: 200,
      height: 60
    },
    {
      id: 2,
      key: 2,
      type: 'custom-node',
      data: {
        label: 'Node 2'
      },
      width: 200,
      height: 60
    },
    {
      id: 4,
      key: 4,
      type: 'loop-node',
      data: {
        label: 'Loop'
      },
      width: 400,
      height: 200
    }
  ];

  // Actions
  const onConnect: OnConnect = useCallback(
    (params) => {
      // Check type of source and target node for add edge
      console.log('🚀 ~ Flow ~ params:', params);
      return setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'custom-edge2',
            data: {
              curve: true
            }
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const genNodeAdd = (position: XYPosition) => {
    return {
      id: getNodeId(),
      type: 'node-add',
      position,
      width: 40,
      height: 40,
      data: { label: '+' }
    };
  };

  const createAddNewNode = useCallback(
    (node: IUnit): OnDropAction => {
      return ({ position, canDrop }) => {
        if (!canDrop) return;

        const newNode: Node = {
          id: getNodeId(),
          type: node.type,
          position,
          width: node.type === 'loop-node' ? 400 : 200,
          height: node.type === 'loop-node' ? 200 : 60,
          data: { label: `${node.data.label}` }
        };
        const newNodeAdd = genNodeAdd({
          x: (newNode?.width ?? 0) / 2 + 20,
          y: position.y + (newNode?.height ?? 0) + 100
        });

        setNodes((nds) => nds.concat([newNode, newNodeAdd]));
        setCreatedNode(null);
      };
    },
    [setNodes, setCreatedNode]
  );

  const onPointDown = (event: PointerEvent<HTMLDivElement>, item: IUnit) => {
    const rect: Rect = { height: item.height, width: item.width, x: 0, y: 0 };

    setCreatedNode(item);
    onDragStart(event, rect, createAddNewNode(item));
  };

  // --- Save initial position for all nodes when drag starts ---
  const onNodeDragStart = useCallback(() => {
    setNodes((nodes: Node[]) =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          dragStartX: n.position.x,
          dragStartY: n.position.y
        }
      }))
    );
  }, [setNodes]);

  // --- While dragging: check intersection for each dragged node ---
  const onNodeDrag = useCallback(
    (_: MouseEvent, __: Node, draggedNodes: Node[]) => {
      draggedNodes.forEach((node) => {
        const hasIntersection = getIntersectingNodes(node).length > 0;

        updateNode(node.id, {
          ...node,
          className: hasIntersection ? 'warning' : ''
        });
      });
    },
    [updateNode, getIntersectingNodes]
  );

  // --- On drag stop: reset overlapping nodes to original positions ---
  const onNodeDragStop = useCallback(
    (_: MouseEvent, __: Node, draggedNodes: Node[]) => {
      draggedNodes.forEach((node) => {
        const isInvalid = node.className?.includes('warning');

        if (isInvalid) {
          const { dragStartX = 0, dragStartY = 0 } = node.data || {};
          updateNode(node.id, {
            ...node,
            className: '',
            position: { x: Number(dragStartX), y: Number(dragStartY) }
          });
        }
      });
    },
    [updateNode]
  );

  const onNodeClick = useCallback(
    (e: MouseEvent, node: Node) => {
      if (!e.ctrlKey) {
        setSelectedNode(node);
      } else {
        setSelectedNode(null);
      }
    },
    [setSelectedNode]
  );

  return (
    <Flex id='flow-page' className='relative h-full rounded-xl flow-page' gap={16}>
      {isDragging && createdNode && <DragGhost unitData={createdNode} />}

      <Flex
        className='absolute top-4 left-4 z-[1] h-[calc(100%-28px)] bg-[rgba(var(--bg-main)/1)] p-4 rounded-lg'
        gap={8}
        vertical
      >
        {fakeData.map((item) => (
          <div
            key={item.key}
            className={classNames(
              'w-[200px] h-[60px] flex items-center justify-center border border-solid rounded border-neutral-400 bg-white'
            )}
            onPointerDown={(e) => onPointDown(e, item)}
          >
            {item.data?.label}
          </div>
        ))}
      </Flex>

      <div className='z-0 flex-1'>
        <ReactFlow
          fitView
          className={clsx('workflow rounded-xl z-0', themeStore ? 'dark' : 'light')}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          proOptions={{ hideAttribution: true }}
        >
          <Controls position='bottom-center' orientation='horizontal' />
          <Background />
        </ReactFlow>
      </div>
    </Flex>
  );
};

interface DragGhostProps {
  unitData: IUnit;
}

function DragGhost({ unitData }: DragGhostProps) {
  const { data, type } = unitData;

  const { getZoom } = useReactFlow();
  const { position, canDrop } = useDnDPosition({ node: unitData });

  const zoom = getZoom();
  const sizeOfNode = useMemo(() => {
    const nodeWidth = type === 'loop-node' ? 400 : 200;
    const nodeHeight = type === 'loop-node' ? 200 : 60;

    return {
      width: nodeWidth * zoom,
      height: nodeHeight * zoom
    };
  }, [type, zoom]);

  if (!position) return null;

  return (
    <div
      className={classNames(
        `flex items-center justify-center bg-white border border-solid rounded border-neutral-400 fixed pointer-events-none z-[2]`,
        canDrop ? '' : 'border-red-500 cursor-not-allowed'
      )}
      style={{
        ...sizeOfNode,
        transform: `translate(${position.x - 12}px, ${position.y - 109}px)`
      }}
    >
      {data.label}
    </div>
  );
}

export default Flow;
