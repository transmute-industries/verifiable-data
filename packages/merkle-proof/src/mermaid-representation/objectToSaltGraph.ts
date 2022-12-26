import { AutographNode, AutographEdge, Autograph  } from './types'

import { SaltedMerkleTree } from '../json-representation/types'


const addEdges = (obj: SaltedMerkleTree, graph:Autograph, i: number  )=>{
  const leafNode = {
    id: obj.leaves[i]
  }
  graph.nodes.push(leafNode)
  const saltNode = {
    id: obj.salts[i]
  }
  graph.nodes.push(saltNode)
  const memberNode = {
    id: obj.members[i]
  }
  graph.nodes.push(memberNode)
  const memberEdge = {
    source: obj.members[i],
    label: 'member',
    target: obj.leaves[i]
  }
  graph.links.push(memberEdge)
  const saltEdge = {
    source: obj.salts[i],
    label: 'salt',
    target: obj.leaves[i]
  }
  graph.links.push(saltEdge)
}
export const objectToSaltGraph = (obj: SaltedMerkleTree, index?: number) => { 
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  let graph: Autograph = { nodes, links}
  obj.leaves.forEach((_, i)=>{
    if (obj.salts){
      if (index === undefined){
        addEdges(obj, graph, i)
      } else if (index === i){
        addEdges(obj, graph, i)
      }
    }
  })
  return graph
}