/* eslint-disable @typescript-eslint/no-explicit-any */
import { tempData } from '@/pages/flow/data/mock';
import { getHierarchyLayout } from '@/pages/flow/utils/d3-hierarchy';
import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState
} from '@xyflow/react';
import { Button } from 'antd';
import { useCallback, useEffect } from 'react';

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const onLayout = useCallback(
    (direction?: any) => {
      console.log(nodes);
      const layouted = getHierarchyLayout(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
    },
    [nodes, edges, setNodes, setEdges]
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
          <Button onClick={() => onLayout()}>layout</Button>
          <Button onClick={() => onLayout('TB')}>vertical layout</Button>
          <Button onClick={() => onLayout('LR')}>horizontal layout</Button>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
