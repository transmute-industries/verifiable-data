
import { SaltedMerkleTree } from '../json-representation/types'
import { objectToSaltGraph } from './objectToSaltGraph'
import { encodedAuditPathToSubgraph } from './encodedAuditPathToSubgraph'
import { graphToMermaid } from './graphToMermaid'
import { fullTreeObjectToFullTreeGraph } from './fullTreeObjectToFullTreeGraph'

import { defaults } from './defaults'
export const inclusionProof = (fullTreeObject: SaltedMerkleTree, index: number) => { 
  
  const fullTreeGraph = fullTreeObjectToFullTreeGraph(fullTreeObject);
  fullTreeGraph.title = 'Tree'
  const saltGraph = objectToSaltGraph(fullTreeObject, index);
  saltGraph.title = 'Leaf'
  const auditPathGraph = encodedAuditPathToSubgraph(fullTreeObject.leaves[index], fullTreeObject.paths[index], fullTreeObject.root)
  auditPathGraph.title = 'Proof'

  const autographOptions = {
    markdown: false, 
    style: 'none',
    linkStyle: defaults.linkStyle,
    nodeStyle: defaults.nodeStyle
  }

  const items = [saltGraph, auditPathGraph, fullTreeGraph ].map((g, i)=>{
    return graphToMermaid(g, { header: i === 0, ...autographOptions } as any )
  })
  return items.join('')
}