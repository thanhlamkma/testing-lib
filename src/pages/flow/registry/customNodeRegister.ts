import CustomNode from '@/pages/flow/components/nodes/CustomNode';
import { FlowNodeType } from '@/pages/flow/models/NodeRegister';
import { createNodeRegister } from '@/pages/flow/services/createNodeRegister';

export const CustomNodeInstance = createNodeRegister({
  nodeType: FlowNodeType.CUSTOM,
  component: CustomNode,
  onNodeDragStop: () => {
    console.log('Drag custom node');
  }
});
