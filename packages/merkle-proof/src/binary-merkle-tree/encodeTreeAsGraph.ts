import base64url from "base64url";

const addEdge = (
  tree: Array<Buffer[]>,
  level: number,
  source: number,
  links: any
) => {
  const target = Math.floor(source / 2);
  if (level > 0) {
    links.push({
      source: base64url.encode(tree[level][source]),
      target: base64url.encode(tree[level - 1][target])
    });
  }
};
export const encodeTreeAsGraph = (tree: Array<Buffer[]>) => {
  const nodes: any[] = [];
  const links: any[] = [];
  tree.forEach((level, leveIndex) => {
    level.forEach((node, nodeIndex) => {
      const id = base64url.encode(node);
      nodes.push({ id });
      addEdge(tree, leveIndex, nodeIndex, links);
    });
  });
  const graph = { nodes, links };
  return graph;
};