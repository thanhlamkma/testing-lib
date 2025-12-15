import LoopNode from '@/pages/flow/components/nodes/LoopNode';
import { FlowNodeType } from '@/pages/flow/models/NodeRegister';
import { createNodeRegister } from '@/pages/flow/services/createNodeRegister';
import { findValidParentLoop, isLoopNode } from '@/pages/flow/utils/flow';

export const LoopNodeInstance = createNodeRegister({
  nodeType: FlowNodeType.LOOP,
  component: LoopNode,
  onNodeDragStop: (event, dragNode, dragNodes, reactFlow) => {
    const { setNodes, getIntersectingNodes } = reactFlow;

    const fullNodes = getIntersectingNodes(dragNode, false);
    const targetLoop = findValidParentLoop(dragNode, fullNodes.filter(isLoopNode));

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id !== dragNode.id) return node;

        if (targetLoop) {
          return {
            ...node,
            parentId: targetLoop.id,
            position: {
              x: dragNode.position.x - targetLoop.position.x,
              y: dragNode.position.y - targetLoop.position.y
            }
          };
        }

        return node;
      })
    );

    // dragNodes.forEach((node) => {
    //   const isInvalid = node.className?.includes('warning');

    //   if (isInvalid) {
    //     const { dragStartX = 0, dragStartY = 0 } = node.data || {};
    //     reactFlow.updateNode(node.id, {
    //       ...node,
    //       className: '',
    //       position: { x: Number(dragStartX), y: Number(dragStartY) }
    //     });
    //   }
    // });
  }
});
