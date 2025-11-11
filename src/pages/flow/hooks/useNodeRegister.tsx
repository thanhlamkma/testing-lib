import { FlowNodeType, NodeRegister } from '@/pages/flow/models/NodeRegister';
import { NodeTypes, OnNodeDrag, useReactFlow } from '@xyflow/react';
import { useCallback, useMemo } from 'react';

export const useNodeRegister = (nodes: NodeRegister[]) => {
  const reactFlow = useReactFlow();

  const nodeTypes = useMemo<NodeTypes>(
    () => Object.fromEntries(nodes.map((n) => [n.nodeType, n.component])),
    [nodes]
  );

  const nodeMapper = useMemo(() => {
    return new Map<string, NodeRegister>(nodes.map((node) => [node.nodeType, node]));
  }, [nodes]);

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
      onNodeDragStop
    }
  };
};

export default useNodeRegister;
