import NodeAdd from '@/pages/flow/components/nodes/NodeAdd';
import { FlowNodeType } from '@/pages/flow/models/NodeRegister';
import { createNodeRegister } from '@/pages/flow/services/createNodeRegister';

export const AddNodeInstance = createNodeRegister({
  nodeType: FlowNodeType.ADD,
  component: NodeAdd,
  onNodeDragStop: () => {
    console.log('Drag add node');
  }
});
