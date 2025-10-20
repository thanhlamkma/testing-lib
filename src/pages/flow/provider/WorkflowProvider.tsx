/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node } from '@xyflow/react';
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

interface IWorkflowContext {
  workflowData: any;
  setWorkflowData: Dispatch<SetStateAction<any>>;
  selectedEdges: string[];
  setSelectedEdges: Dispatch<SetStateAction<string[]>>;
  settingNodeType: string;
  setSettingNodeType: Dispatch<SetStateAction<string>>;
  selectedNode: Node | null;
  setSelectedNode: Dispatch<SetStateAction<Node | null>>;
}

export const WorkflowContext = createContext<IWorkflowContext | undefined>(undefined);

const WorkflowProvider = ({ children }: { children: ReactNode }) => {
  const [workflowData, setWorkflowData] = useState();
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const [settingNodeType, setSettingNodeType] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const contextValue: IWorkflowContext = {
    workflowData,
    setWorkflowData,
    selectedEdges,
    setSelectedEdges,
    settingNodeType,
    setSettingNodeType,
    selectedNode,
    setSelectedNode
  };

  return <WorkflowContext.Provider value={contextValue}>{children}</WorkflowContext.Provider>;
};

export default WorkflowProvider;
