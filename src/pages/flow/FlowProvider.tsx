/* eslint-disable @typescript-eslint/no-explicit-any */
import Flow from '@/pages/flow/Flow';
import { DnDProvider } from '@/pages/flow/provider/useDnd';
import { ReactFlowProvider } from '@xyflow/react';

const FlowProvider = (props: any) => {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <Flow {...props} />
      </DnDProvider>
    </ReactFlowProvider>
  );
};

export default FlowProvider;
