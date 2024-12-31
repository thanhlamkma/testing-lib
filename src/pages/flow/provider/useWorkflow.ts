import { WorkflowContext } from '@/pages/flow/provider/WorkflowProvider';
import { useContext } from 'react';

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);

  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }

  return context;
};
