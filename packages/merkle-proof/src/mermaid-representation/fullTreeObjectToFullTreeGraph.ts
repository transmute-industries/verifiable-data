

import { MerkleTreeObject } from "../json-representation/types";
import { Autograph, AutographNode, AutographEdge } from "./types";

import { makeMermaidSafe } from './makeMermaidSafe'

const getNode = (g: Autograph, n: AutographNode)=>{
  return g.nodes.find((gn)=>{
    return gn.id === n.id
  });
}

const addNode = (g: Autograph, n: AutographNode) =>{
  const exists = getNode(g, n);
  if (!exists){
    g.nodes.push(n)
  }
}

const getEdge = (g: Autograph, e: AutographEdge)=>{
  return g.links.find((ge)=>{
    return ge.source === e.source && ge.target === e.target
  });
}

const addEdge = (g: Autograph, e: AutographEdge) =>{
  const exists = getEdge(g, e);
  if (!exists){
    g.links.push(e)
  }
}

const onlyOneOutgoingEdge = (g: Autograph, source: string, _target: string) => {
  return g.links.find((e) => {
    return e.source === source
  }) === undefined
}

export const fullTreeObjectToFullTreeGraph = (
  tree: MerkleTreeObject
): Autograph => {
  const g: Autograph = {title: "Merkle Tree", nodes: [], links: []}
  const rootNode = {
    id: tree.root,
    label: tree.root,
    isRoot: true
  }
  addNode(g, rootNode)
  tree.leaves.forEach((_leaf, leafIndex)=>{
    const leafId = tree.leaves[leafIndex]
    const leafNode = {
      id: leafId,
      label: leafId,
      isLeaf: true
    }
    addNode(g, leafNode)
    const pathComponents = tree.paths[leafIndex].split('~')
    let lastPathComponentId = leafId;
    pathComponents.forEach((pc, pi)=>{
      const [d, pathNodeId] = pc.split('.')
      const direction = d === 'L' ? 'left': 'right';
      const pathNode = {
        id: pathNodeId,
        label: pathNodeId,
        isLeaf: tree.leaves.includes(pathNodeId)
      }
      addNode(g, pathNode)
      const pathEdge = {
        source: lastPathComponentId,
        target: pathNode.id,
        label: direction,
        fromLeaf: tree.leaves.includes(lastPathComponentId),
      }
      if (onlyOneOutgoingEdge(g, pathEdge.source, pathEdge.target )){
        addEdge(g, pathEdge)
      }
      lastPathComponentId = pathNode.id;
      if (pi === pathComponents.length -1){
        const proofEdge = {
          source: pathEdge.target,
          target: rootNode.id,
          label: 'proof',
          toRoot: true
        }
        addEdge(g, proofEdge)
      }
    }) 
  })
  makeMermaidSafe(g)
  return g;
};
