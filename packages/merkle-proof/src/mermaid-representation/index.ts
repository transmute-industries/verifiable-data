import { graphToMermaid } from './graphToMermaid'

import { encodedAuditPathToSubgraph } from './encodedAuditPathToSubgraph'

import { wrapForMarkdown } from './wrapForMarkdown'
import { objectToSaltGraph } from './objectToSaltGraph'
import { inclusionProof } from './inclusionProof'
import { fullTreeObjectToFullTreeGraph } from './fullTreeObjectToFullTreeGraph'

import { defaults } from './defaults'

const MerkleMermaid = { defaults, graphToMermaid, encodedAuditPathToSubgraph, wrapForMarkdown, objectToSaltGraph, inclusionProof, fullTreeObjectToFullTreeGraph };

export default MerkleMermaid