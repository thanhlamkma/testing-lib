/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Background,
  Controls,
  NodeTypes,
  ReactFlow,
  XYPosition,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type EdgeTypes,
  type Node,
  type OnConnect
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import './styles/index.scss';

import { darkThemeStoreState } from '@/common/stores/ThemeStore';
import CustomNode from '@/pages/flow/components/CustomNode';
import LoopNode from '@/pages/flow/components/LoopNode';
import { OnDropAction, useDnD, useDnDPosition } from '@/pages/flow/provider/useDnd';
import { Flex } from 'antd';
import classNames from 'classnames';
import clsx from 'clsx';
import { useRecoilValue } from 'recoil';
import CustomEdge from './components/CustomEdge';
import CustomEdgeStartEnd from './components/CustomEdgeStartEnd';

let id = 0;
const getId = () => `dndnode_${id++}`;

const Flow = () => {
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const { setNodes } = useReactFlow();

  const themeStore = useRecoilValue(darkThemeStoreState);
  const { onDragStart, isDragging } = useDnD();

  const [label, setLabel] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  // Data
  const nodeTypes = {
    'loop-node': LoopNode,
    'custom-node': CustomNode
  };
  const edgeTypes: EdgeTypes = {
    custom: CustomEdge,
    'start-end': CustomEdgeStartEnd
  };

  const fakeData = [
    {
      id: 1,
      key: 1,
      type: 'custom-node',
      data: {
        label: 'Node 1'
      }
    },
    {
      id: 2,
      key: 2,
      type: 'custom-node',
      data: {
        label: 'Node 2'
      }
    },
    {
      id: 4,
      key: 4,
      type: 'loop-node',
      data: {
        label: 'Loop'
      }
    }
  ];

  // Actions
  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'custom'
          },
          eds
        )
      ),
    [setEdges]
  );

  const onNodeDragStart = (e: React.MouseEvent, node: NodeTypes) => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        dragStartX: n.position.x,
        dragStartY: n.position.y
      }))
    );
  };

  const onNodeDrag = (e: React.MouseEvent, node: NodeTypes, nodes: NodeTypes[]) => {
    // console.log(e, node, nodes);
  };

  const createAddNewNode = useCallback(
    (node: Node): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        const newNode: Node = {
          id: getId(),
          type: node.type,
          position,
          width: node.type === 'loop-node' ? 400 : 200,
          height: node.type === 'loop-node' ? 200 : 60,
          data: { label: `${node.data.label}` }
        };

        setNodes((nds) => nds.concat(newNode));
        setType(null);
      };
    },
    [setNodes, setType]
  );

  return (
    <Flex id='flow-page' className='relative h-full rounded-xl flow-page' gap={16}>
      {isDragging && <DragGhost label={label} type={type} />}

      <Flex
        className='absolute top-4 left-4 z-[1] h-[calc(100%-28px)] bg-[rgba(var(--bg-main)/1)] p-4 rounded-lg'
        gap={8}
        vertical
      >
        {fakeData.map((item) => (
          <div
            key={item.key}
            className='w-[200px] h-[60px] flex items-center justify-center border border-solid rounded border-neutral-400 bg-white'
            onPointerDown={(event) => {
              setType(item.type);
              setLabel(item.data?.label ?? '');
              onDragStart(event, createAddNewNode(item as any));
            }}
          >
            {item.data?.label}
          </div>
        ))}
      </Flex>

      <div className='z-0 flex-1'>
        <ReactFlow
          className={clsx('workflow rounded-xl z-0', themeStore ? 'dark' : 'light')}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeDrag={onNodeDrag}
          onNodeDragStart={onNodeDragStart}
          fitView
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
  label: string | null;
  type: string | null;
}

function DragGhost({ type, label }: DragGhostProps) {
  const { position } = useDnDPosition();

  if (!position) return null;

  return (
    <div
      className={classNames(
        `w-[132px] flex items-center justify-center h-16 bg-white border border-solid rounded border-neutral-400 fixed pointer-events-none z-[2]`,
        type === 'loop-node' ? 'w-[400px] h-[200px]' : 'w-[200px] h-[60px]'
      )}
      style={{
        transform: `translate(${position.x - 32}px, ${position.y - 112}px) translate(-50%, -50%)`
      }}
    >
      {label}
    </div>
  );
}

export default Flow;
