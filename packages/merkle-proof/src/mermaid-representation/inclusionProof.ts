
import { SaltedMerkleTree } from '../json-representation/types'
import { objectToSaltGraph } from './objectToSaltGraph'
import { encodedAuditPathToSubgraph } from './encodedAuditPathToSubgraph'
import { graphToMermaid } from './graphToMermaid'
import { fullTreeObjectToFullTreeGraph } from './fullTreeObjectToFullTreeGraph'

import { defaults } from './defaults'

import { wrapForMarkdown } from './wrapForMarkdown'

export const inclusionProof = (fullTreeObject: SaltedMerkleTree, reveal?: number[]) => { 

  const graphs = []

  // everything if nothing.
  reveal = reveal || fullTreeObject.members.map((_m, i) => {
    return i
  })

  let styles = `%% Transmute Style \n`

  let linkCount = 0;

  reveal.forEach((index)=>{
    const saltGraph = objectToSaltGraph(fullTreeObject, index);
    saltGraph.title = 'Leaf ' + index;
    graphs.push(saltGraph);

    styles += `%% Leaf Styles \n`
    saltGraph.nodes.forEach((n)=>{
      styles += `style ${n.id} color: ${defaults.transmute.primary.white}, fill:${defaults.transmute.primary.purple.light}, stroke: ${defaults.transmute.primary.purple.dark}, stroke-width: 2.0px\n`
    })
    for (let i = 0 + linkCount; i < saltGraph.links.length; i++){
      styles += `linkStyle ${i} color: ${defaults.transmute.primary.orange}, stroke: ${defaults.transmute.secondary.light}, stroke-width: 2.0px\n`
    }
    linkCount += saltGraph.links.length
  
    const auditPathGraph = encodedAuditPathToSubgraph(fullTreeObject.leaves[index], fullTreeObject.paths[index], fullTreeObject.root)
    // this subtraph title gets floated if present due to tree including the proof.
    auditPathGraph.title = 'Proof ' + index; 
    graphs.push(auditPathGraph);

    styles += `%% Proof Styles \n`
    for (let i = linkCount; i < linkCount + auditPathGraph.links.length; i++){
      const e = auditPathGraph.links[i - linkCount ];
      if (e.label === 'proof'){
        styles += `linkStyle ${i} color: ${defaults.transmute.primary.orange}, stroke: ${defaults.transmute.secondary.light}, stroke-width: 2.0px\n`
      } else {
        styles += `linkStyle ${i} color: ${defaults.transmute.primary.red}, stroke: ${defaults.transmute.secondary.light}, stroke-width: 2.0px\n`
      }
    }
    linkCount += auditPathGraph.links.length
    auditPathGraph.nodes.forEach((n)=>{
      if (!n.isLeaf){
        styles += `style ${n.id} color: ${defaults.transmute.secondary.light}, stroke: ${defaults.transmute.secondary.light}, stroke-width: 2.0px\n`
      }
    })

  })


  const autographOptions = {
    markdown: false, 
    style: 'transmute',
    linkStyle: defaults.linkStyle,
    nodeStyle: defaults.nodeStyle
  }

  const fullTreeGraph = fullTreeObjectToFullTreeGraph(fullTreeObject);
  fullTreeGraph.title = 'Tree'
  graphs.push(fullTreeGraph);

  styles += `%% Root Style \n`
  styles += `style ${fullTreeGraph.nodes[0].id} color: ${defaults.transmute.primary.white}, fill:${defaults.transmute.primary.purple.light}, stroke: ${defaults.transmute.primary.purple.dark}, stroke-width: 2.0px\n`
  

  fullTreeGraph.nodes = fullTreeGraph.nodes.map((n)=>{
    delete n.isLeaf
    return n;
  })

  const diagrams = graphs.map((g, i)=>{
    return graphToMermaid(g, { header: i === 0, ...autographOptions } as any )
  }).join('')


  const final = diagrams + `\n` + styles;

  return wrapForMarkdown(final)
}