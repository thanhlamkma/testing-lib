/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, Node, NodeProps, ReactFlowInstance } from '@xyflow/react';
import { ComponentType } from 'react';

export type OnFlowNodeDrag = (
  event: React.MouseEvent,
  node: Node,
  nodes: Node[],
  reactFlow: ReactFlowInstance
) => void;

export interface NodeRegister<T extends string = string, P extends NodeProps = any> {
  nodeType: T;
  component: ComponentType<P>;

  // Event handlers
  onNodeDragStart?: OnFlowNodeDrag;
  onNodeDrag?: OnFlowNodeDrag;
  onNodeDragStop?: OnFlowNodeDrag;
  onConnectionValidate?: (connection: Connection) => boolean;
}

export enum FlowNodeType {
  START_END = 'START_END',
  LOOP = 'LOOP',
  ADD = 'ADD',
  CUSTOM = 'CUSTOM'
}
