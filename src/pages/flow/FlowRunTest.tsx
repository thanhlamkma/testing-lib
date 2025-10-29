/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactFlow } from '@xyflow/react';
import { Button, Flex } from 'antd';
import { useCallback, useEffect, useState } from 'react';

export type FlowStatus = 'new' | 'editing' | 'saved';

const FlowRunTest = () => {
  const [flowData, setFlowData] = useState<any>();
  const [status, setStatus] = useState<FlowStatus>('new');

  const onNodeChange = useCallback(() => {
    if (status === 'saved') setStatus('editing');
  }, [status]);

  const onEdgeChange = useCallback(() => {
    if (status === 'saved') setStatus('editing');
  }, [status]);

  const handleSave = async () => {
    // await api.saveFlow(flowData);
    setStatus('saved');
  };

  const handleRun = async () => {
    if (status !== 'saved') return; // hoặc disable button
    // await api.runFlow(flowData);
  };

  const handleLoadFlow = async (id: string) => {
    console.log('🚀 ~ handleLoadFlow ~ id:', id);
    // const data = await api.getFlowDetail(id);
    setFlowData({ a: 1 });
    setStatus('saved');
  };

  useEffect(() => {
    handleLoadFlow('1');
  }, []);

  // React Flow events
  return (
    <div className='flex flex-col h-full'>
      <Flex>
        <Button disabled={status !== 'saved'} onClick={handleRun}>
          Run test
        </Button>
        <Button type='primary' onClick={handleSave}>
          Save
        </Button>
      </Flex>

      <ReactFlow
        nodes={flowData?.nodes || []}
        edges={flowData?.edges || []}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
      />
    </div>
  );
};

export default FlowRunTest;
