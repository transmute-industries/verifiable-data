import { graphToMermaid } from './graphToMermaid'

import { encodedAuditPathToSubgraph } from './encodedAuditPathToSubgraph'

import { wrapForMarkdown } from './wrapForMarkdown'
import { objectToSaltGraph } from './objectToSaltGraph'
import { inclusionProof } from './inclusionProof'
import { fullTreeObjectToFullTreeGraph } from './fullTreeObjectToFullTreeGraph'
const MerkleMermaid = { graphToMermaid, encodedAuditPathToSubgraph, wrapForMarkdown, objectToSaltGraph, inclusionProof, fullTreeObjectToFullTreeGraph };

export default MerkleMermaid