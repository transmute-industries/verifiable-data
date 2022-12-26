import base64url from "base64url";

import { makeMermaidSafe } from '../mermaid-representation/makeMermaidSafe';

const getNodeProperties = (tree: Array<Buffer[]>, leveIndex: number, nodeIndex: number ) => {
  const targetHash = tree[leveIndex][nodeIndex]
  const id = base64url.encode(targetHash);
  let props:any = {
    id,
    label: id
  }
  if (leveIndex === 0){
    props.isRoot = true
  }
  if (leveIndex === tree.length-1){
    props.isLeaf = true
  }
  return props;
}

const getEdgeProperties = (tree: Array<Buffer[]>, leveIndex: number, nodeIndex:number ) => {
  const target = Math.floor(nodeIndex / 2);
  const sourceId = base64url.encode(tree[leveIndex][nodeIndex])
  const targetId = base64url.encode(tree[leveIndex - 1][target])
  let props:any = {
    source: sourceId,
    target: targetId
  }
  if (leveIndex === 1){
    props.toRoot = true
  }
  if (leveIndex === tree.length-1){
    props.fromLeaf = true
  }
  return props
}

export const encodeTreeAsGraph = (tree: Array<Buffer[]>) => {
  const nodes: any[] = [];
  const links: any[] = [];
  tree.forEach((level, leveIndex) => {
    level.forEach((_, nodeIndex) => {
      const node: any = getNodeProperties(tree, leveIndex, nodeIndex);
      nodes.push(node);
      if (leveIndex > 0) {
        const edge: any = getEdgeProperties(tree, leveIndex, nodeIndex)
        links.push(edge);
      }
    });
  });
  const graph = { nodes, links };
  makeMermaidSafe(graph);
  return graph;
};