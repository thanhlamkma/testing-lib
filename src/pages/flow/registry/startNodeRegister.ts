import NodeStartEnd from '@/pages/flow/components/nodes/NodeStartEnd';
import { FlowNodeType } from '@/pages/flow/models/NodeRegister';
import { createNodeRegister } from '@/pages/flow/services/createNodeRegister';

export const StartEndNodeInstance = createNodeRegister({
  nodeType: FlowNodeType.START_END,
  component: NodeStartEnd
});
