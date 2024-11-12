import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { ReactNode } from 'react';

interface FlowProviderProps {
  children: ReactNode;
}

const FlowProvider = ({ children }: FlowProviderProps) => {
  const { fitView } = useReactFlow();

  window.requestAnimationFrame(() => {
    fitView();
  });

  return <ReactFlowProvider>{children}</ReactFlowProvider>;
};

export default FlowProvider;
