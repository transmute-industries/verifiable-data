
import { SaltedMerkleTree } from '../json-representation/types'
import { objectToSaltGraph } from './objectToSaltGraph'
import { encodedAuditPathToSubgraph } from './encodedAuditPathToSubgraph'
import { fromGraphs } from './fromGraphs'
import { fullTreeObjectToFullTreeGraph } from './fullTreeObjectToFullTreeGraph'

export const inclusionProof = (fullTreeObject: SaltedMerkleTree, index: number) => { 
  const fullTreeGraph = fullTreeObjectToFullTreeGraph(fullTreeObject);
  fullTreeGraph.title = 'Tree'
  const saltGraph = objectToSaltGraph(fullTreeObject, index);
  saltGraph.title = 'Leaf'
  const auditPathGraph = encodedAuditPathToSubgraph(fullTreeObject.leaves[index], fullTreeObject.paths[index], fullTreeObject.root)
  auditPathGraph.title = 'Proof'
  const mermaidMultigraph = fromGraphs([saltGraph, auditPathGraph, fullTreeGraph ])
  return mermaidMultigraph
}