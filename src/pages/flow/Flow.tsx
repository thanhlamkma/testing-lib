import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Edge,
  type EdgeTypes,
  type Node,
  type OnConnect
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import './styles/index.scss';

import { darkThemeStoreState } from '@/common/stores/ThemeStore';
import WorkflowProvider from '@/pages/flow/provider/WorkflowProvider';
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

const Flow = () => {
  const themeStore = useRecoilValue(darkThemeStoreState);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const edgeTypes: EdgeTypes = {
    custom: CustomEdge,
    'start-end': CustomEdgeStartEnd
  };

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <WorkflowProvider>
      <ReactFlow
        className={clsx('workflow', themeStore ? 'dark' : 'light')}
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
      </ReactFlow>
    </WorkflowProvider>
  );
};

export default Flow;
