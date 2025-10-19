/* eslint-disable @typescript-eslint/no-explicit-any */
import Flow from '@/pages/flow/Flow';
import { DnDProvider } from '@/pages/flow/provider/useDnd';
import WorkflowProvider from '@/pages/flow/provider/WorkflowProvider';
import { ReactFlowProvider } from '@xyflow/react';

const FlowProvider = (props: any) => {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <WorkflowProvider>
          <Flow {...props} />
        </WorkflowProvider>
      </DnDProvider>
    </ReactFlowProvider>
  );
};

export default FlowProvider;
