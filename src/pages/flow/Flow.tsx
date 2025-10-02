import {
  Background,
  Controls,
  Panel,
  ReactFlow,
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
import { useCallback, useState } from 'react';
import './styles/index.scss';

import { darkThemeStoreState } from '@/common/stores/ThemeStore';
import { RectangleTool } from '@/pages/flow/components/RectangleTool';
import { OnDropAction, useDnD, useDnDPosition } from '@/pages/flow/provider/useDnd';
import WorkflowProvider from '@/pages/flow/provider/WorkflowProvider';
import { Flex } from 'antd';
import clsx from 'clsx';
import { useRecoilValue } from 'recoil';
import CustomEdge from './components/CustomEdge';
import CustomEdgeStartEnd from './components/CustomEdgeStartEnd';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 }
  },
  { id: '2', data: { label: 'Node 2' }, position: { x: -120, y: 300 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 0 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 300 } },
  { id: '5', data: { label: 'Node 5' }, position: { x: 120, y: 300 } }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    data: {
      label: 'edge label'
    },
    type: 'custom'
  },
  {
    id: 'e1-5',
    source: '1',
    target: '5',
    data: {
      label: 'edge label'
    },
    type: 'custom'
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    data: {
      startLabel: 'start edge label',
      endLabel: 'end edge label'
    },
    type: 'start-end'
  }
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Flow = () => {
  const themeStore = useRecoilValue(darkThemeStoreState);

  const [isRectangleActive, setIsRectangleActive] = useState(true);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const edgeTypes: EdgeTypes = {
    custom: CustomEdge,
    'start-end': CustomEdgeStartEnd
  };

  const fakeData = [
    {
      id: 1,
      key: 1,
      type: 'input',
      label: 'Node 1'
    },
    {
      id: 2,
      key: 2,
      type: 'Default',
      label: 'Node 2'
    },
    {
      id: 3,
      key: 3,
      type: 'output',
      label: 'Node 3'
    }
  ];

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Drag drop
  const { onDragStart, isDragging } = useDnD();
  // The type of the node that is being dragged.
  const [type, setType] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  const { setNodes } = useReactFlow();

  const createAddNewNode = useCallback(
    (nodeType: string): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        // Here, we create a new node and add it to the flow.
        // You can customize the behavior of what happens when a node is dropped on the flow here.
        const newNode = {
          id: getId(),
          type: nodeType,
          position,
          data: { label: `${nodeType} node` }
        };

        setNodes((nds) => nds.concat(newNode));
        setType(null);
      };
    },
    [setNodes, setType]
  );

  return (
    <Flex className='h-full' gap={16}>
      {isDragging && <DragGhost label={label} type={type} />}

      <Flex className='w-[160px] bg-white p-4 rounded' gap={8} vertical>
        {fakeData.map((item) => (
          <div
            key={item.key}
            className='w-[132px] flex items-center justify-center h-16 border border-solid rounded border-neutral-400'
            onPointerDown={(event) => {
              setType(item.type);
              setLabel(item.label);
              onDragStart(event, createAddNewNode(item.type));
            }}
          >
            {item.label} - {item.type}
          </div>
        ))}
      </Flex>

      <div className='z-0 flex-1'>
        <WorkflowProvider>
          <ReactFlow
            className={clsx('workflow rounded z-0', themeStore ? 'dark' : 'light')}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            edgeTypes={edgeTypes}
            fitView
          >
            <Controls />
            <Background />

            {isRectangleActive && <RectangleTool />}

            <Panel position='top-left'>
              <div className='xy-theme__button-group'>
                <button
                  className={`xy-theme__button ${isRectangleActive ? 'active' : ''}`}
                  onClick={() => setIsRectangleActive(true)}
                >
                  Rectangle Mode
                </button>
                <button
                  className={`xy-theme__button ${!isRectangleActive ? 'active' : ''}`}
                  onClick={() => setIsRectangleActive(false)}
                >
                  Selection Mode
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </WorkflowProvider>
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
      className={`w-[132px] flex items-center justify-center h-16 bg-white border border-solid rounded border-neutral-400 fixed pointer-events-none z-10`}
      style={{
        transform: `translate(${position.x - 32}px, ${position.y - 112}px) translate(-50%, -50%)`
      }}
    >
      {label} - {type}
    </div>
  );
}

export default Flow;
