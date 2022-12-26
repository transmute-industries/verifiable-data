import { AutographNode, AutographEdge, Autograph  } from './types'

import { SaltedMerkleTree } from '../json-representation/types'

import { graphToMermaid } from './graphToMermaid';

// const graphAddition = (g0: Autograph, g1: Autograph ): Autograph =>{
//   const copy: Autograph = JSON.parse(JSON.stringify(g0));
//   g1.nodes.forEach((n)=>{
//     copy.nodes.push(n)
//   })
//   g1.links.forEach((e)=>{
//     copy.links.push(e)
//   })
//   return copy
// }



export const objectToMermaid = (obj: SaltedMerkleTree) => { 
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  let graph: Autograph = { nodes, links}
  console.log(obj)
  obj.leaves.forEach((_, i)=>{
    const leafNode = {
       id: obj.leaves[i]
    }
    nodes.push(leafNode)
    if (obj.salts){
      const saltNode = {
        id: obj.salts[i]
      }
      nodes.push(saltNode)
      const memberNode = {
        id: obj.members[i]
      }
      nodes.push(memberNode)
      const memberEdge = {
        source: obj.members[i],
        label: 'member',
        target: obj.leaves[i]
      }
      links.push(memberEdge)
      const saltEdge = {
        source: obj.salts[i],
        label: 'salt',
        target: obj.leaves[i]
      }
      links.push(saltEdge)
    }

    // const g2 = encodedAuditPathToSubgraph(obj.leaves[i], obj.paths[i], obj.root)
    // graph = graphAddition(graph, g2)
    // console.log(g2)
  })
  return graphToMermaid(graph);
}