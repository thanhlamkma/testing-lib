import { FlowNodeType, NodeRegister } from '@/pages/flow/models/NodeRegister';
import { findValidParentLoop, isLoopNode } from '@/pages/flow/utils/flow';
import { NodeTypes, OnNodeDrag, useReactFlow, XYPosition } from '@xyflow/react';
import { useCallback, useMemo, useRef } from 'react';

export const useNodeRegister = (nodes: NodeRegister[]) => {
  const reactFlow = useReactFlow();
  const { getIntersectingNodes, updateNode, setNodes } = reactFlow;

  const originNodesRef = useRef(new Map<string, XYPosition>());

  const nodeTypes = useMemo<NodeTypes>(
    () => Object.fromEntries(nodes.map((n) => [n.nodeType, n.component])),
    [nodes]
  );

  const nodeMapper = useMemo(() => {
    return new Map<string, NodeRegister>(nodes.map((node) => [node.nodeType, node]));
  }, [nodes]);

  const onNodeDragStart: OnNodeDrag = (_event, _dragNode, dragNodes) => {
    dragNodes.forEach((node) => {
      originNodesRef.current.set(node.id, node.position);
    });
  };

  const onNodeDrag: OnNodeDrag = (_event, dragNode) => {
    const fullNodes = getIntersectingNodes(dragNode, false);
    const availableLoop = findValidParentLoop(dragNode, fullNodes.filter(isLoopNode));

    // if (availableLoop) {
    //   updateNode(availableLoop.id, {
    //     className: 'warning'
    //   });
    // }
    // setNodes((prevNodes) =>
    //   prevNodes.map((node) => {
    //     if (node.type !== FlowNodeType.LOOP) return node;

    //     return {
    //       ...node,
    //       className: node.id === availableLoop?.id ? 'warning' : undefined
    //     };
    //   })
    // );
  };

  const onNodeDragStop: OnNodeDrag = useCallback(
    (event, dragNode, dragNodes) => {
      const node = nodeMapper.get(dragNode?.type ?? FlowNodeType.CUSTOM);
      node?.onNodeDragStop?.(event, dragNode, dragNodes, reactFlow);
    },
    [nodeMapper, reactFlow]
  );

  return {
    nodeTypes,
    handler: {
      onNodeDragStart,
      onNodeDrag,
      onNodeDragStop
    }
  };
};

export default useNodeRegister;
