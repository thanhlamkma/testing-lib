import LoopNode from '@/pages/flow/components/nodes/LoopNode';
import { FlowNodeType } from '@/pages/flow/models/NodeRegister';
import { createNodeRegister } from '@/pages/flow/services/createNodeRegister';

export const LoopNodeInstance = createNodeRegister({
  nodeType: FlowNodeType.LOOP,
  component: LoopNode,
  onNodeDragStop: (event, dragNode, dragNodes, reactFlow) => {
    console.log('Drag loop node');
    dragNodes.forEach((node) => {
      const isInvalid = node.className?.includes('warning');

      if (isInvalid) {
        const { dragStartX = 0, dragStartY = 0 } = node.data || {};
        reactFlow.updateNode(node.id, {
          ...node,
          className: '',
          position: { x: Number(dragStartX), y: Number(dragStartY) }
        });
      }
    });
  }
});
