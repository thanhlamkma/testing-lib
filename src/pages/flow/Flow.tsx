/* eslint-disable @typescript-eslint/no-explicit-any */
import { tempData } from '@/pages/flow/data/mock';
import { getDagreLayout } from '@/pages/flow/utils/dagre';
import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';
import { Button } from 'antd';
import { useCallback, useEffect } from 'react';

const Flow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const onLayout = useCallback(
    (direction: any) => {
      console.log(nodes);
      const layouted = getDagreLayout(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges, setEdges, setNodes]
  );

  useEffect(() => {
    setNodes(
      tempData.vertices.map((item, index) => {
        return {
          ...item,
          data: { label: item.id },
          position: { x: 0, y: index * 100 }
        };
      })
    );

    setEdges(
      tempData.edges.map((item) => ({
        ...item,
        id: `${item.source}-${item.target}`
      }))
    );
  }, [setNodes, setEdges]);

  return (
    <div className='flow-page'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Panel className='flex gap-2' position='top-right'>
          <Button onClick={() => onLayout('TB')}>Vertical</Button>
          <Button onClick={() => onLayout('LR')}>Horizontal</Button>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
