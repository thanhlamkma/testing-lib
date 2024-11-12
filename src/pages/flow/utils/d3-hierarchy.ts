/* eslint-disable @typescript-eslint/no-explicit-any */
import { stratify, tree } from 'd3-hierarchy';

const g = tree();

export const getHierarchyLayout = (nodes: any, edges: any, options: any) => {
  if (nodes.length === 0) return { nodes, edges };

  const { width, height } = document
    ?.querySelector(`[data-id="${nodes[0].id}"]`)
    ?.getBoundingClientRect() as any;
  const hierarchy = stratify()
    .id((node: any) => node.id)
    .parentId((node: any) => edges.find((edge: any) => edge.target === node.id)?.source);
  const root = hierarchy(nodes);
  const layout = g.nodeSize([width * 2, height * 2])(root);

  return {
    nodes: layout
      .descendants()
      .map((node: any) => ({ ...node.data, position: { x: node.x, y: node.y } })),
    edges
  };
};
