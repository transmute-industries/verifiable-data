import { AutographNode, AutographEdge, Autograph } from "./types";

import { SaltedMerkleTree } from "../json-representation/types";

import { makeMermaidSafe } from "./makeMermaidSafe";

const addEdges = (obj: SaltedMerkleTree, graph: Autograph, i: number) => {
  const leafNode = {
    id: obj.leaves[i],
    label: obj.leaves[i],
    isLeaf: true
  };
  graph.nodes.push(leafNode);
  if (obj.salts) {
    const saltNode = {
      id: obj.salts[i],
      label: obj.salts[i],
      isSalt: true
    };
    graph.nodes.push(saltNode);
  }

  const memberNode = {
    id: obj.members[i],
    label: obj.members[i],
    isMember: true
  };
  graph.nodes.push(memberNode);
  const memberEdge = {
    source: obj.members[i],
    label: "member",
    target: obj.leaves[i]
  };
  graph.links.push(memberEdge);
  if (obj.salts) {
    const saltEdge = {
      source: obj.salts[i],
      label: "salt",
      target: obj.leaves[i]
    };
    graph.links.push(saltEdge);
  }
};
export const objectToSaltGraph = (obj: SaltedMerkleTree, index?: number) => {
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  let graph: Autograph = { nodes, links };
  obj.leaves.forEach((_, i) => {
    if (index === undefined) {
      addEdges(obj, graph, i);
    } else if (index === i) {
      addEdges(obj, graph, i);
    }
  });
  makeMermaidSafe(graph);
  return graph;
};
