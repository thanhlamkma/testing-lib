import { FlowNodeType } from '@/pages/flow/models/NodeRegister';
import { Node, Rect } from '@xyflow/react';

export const getNodeRect = (node: Node): Rect => {
  return {
    ...node.position,
    width: node.measured?.width || 0,
    height: node.measured?.height || 0
  };
};

export const isLoopNode = (node: Node) => node.type === FlowNodeType.LOOP;

export const findValidParentLoop = (dragNode: Node, loopNodes: Node[]): Node | null => {
  let target: Node | null = null;

  for (const loop of loopNodes) {
    const loopWidth = loop.measured?.width || 0;
    const loopHeight = loop.measured?.height || 0;
    const dragWidth = dragNode.measured?.width || 0;
    const dragHeight = dragNode.measured?.width || 0;

    // Ưu tiên LOOP nhỏ hơn (nested)
    if (!target || (loopWidth < dragWidth && loopHeight < dragHeight)) {
      target = loop;
    }
  }

  return target;
};
