// import { AutographNode, AutographEdge, Autograph  } from './types'

import { SaltedMerkleTree } from '../json-representation/types'

import { objectToSaltGraph } from './objectToSaltGraph'
import { encodedAuditPathToSubgraph } from './encodedAuditPathToSubgraph'
import { fromGraphs } from './fromGraphs'
import { fullTreeObjectToFullTreeGraph } from './fullTreeObjectToFullTreeGraph'

export const inclusionProof = (fullTreeObject: SaltedMerkleTree, index: number) => { 
  const fullTreeGraph = fullTreeObjectToFullTreeGraph(fullTreeObject);
  const saltGraph = objectToSaltGraph(fullTreeObject, index);
  const auditPathGraph = encodedAuditPathToSubgraph(fullTreeObject.leaves[index], fullTreeObject.paths[index], fullTreeObject.root)
  const mermaidMultigraph = fromGraphs([saltGraph, fullTreeGraph, auditPathGraph])
  return mermaidMultigraph
}