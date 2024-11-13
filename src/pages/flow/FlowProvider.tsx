/* eslint-disable @typescript-eslint/no-explicit-any */
import Flow from '@/pages/flow/Flow';
import { ReactFlowProvider } from '@xyflow/react';

const FlowProvider = (props: any) => {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
};

export default FlowProvider;
