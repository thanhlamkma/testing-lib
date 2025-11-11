import { NodeRegister } from '@/pages/flow/models/NodeRegister';
import { AddNodeInstance } from '@/pages/flow/registry/addNodeRegister';
import { CustomNodeInstance } from '@/pages/flow/registry/customNodeRegister';
import { LoopNodeInstance } from '@/pages/flow/registry/loopNodeRegister';
import { StartEndNodeInstance } from '@/pages/flow/registry/startNodeRegister';

export const nodeRegisters: NodeRegister[] = [
  StartEndNodeInstance,
  LoopNodeInstance,
  AddNodeInstance,
  CustomNodeInstance
];
