/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeRegister } from '@/pages/flow/models/NodeRegister';
import { NodeProps } from '@xyflow/react';

export function createNodeRegister<T extends string = string, P extends NodeProps = any>(
  node: NodeRegister<T, P>
): NodeRegister<T, P> {
  return node;
}
