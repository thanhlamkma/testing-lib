/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

interface IWorkflowContext {
  workflowData: any;
  setWorkflowData: Dispatch<SetStateAction<any>>;
  selectedEdges: string[];
  setSelectedEdges: Dispatch<SetStateAction<string[]>>;
}

export const WorkflowContext = createContext<IWorkflowContext | undefined>(undefined);

const WorkflowProvider = ({ children }: { children: ReactNode }) => {
  const [workflowData, setWorkflowData] = useState();
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  const contextValue = {
    workflowData,
    setWorkflowData,
    selectedEdges,
    setSelectedEdges
  };

  return <WorkflowContext.Provider value={contextValue}>{children}</WorkflowContext.Provider>;
};

export default WorkflowProvider;
