import { graphToMermaid } from './graphToMermaid'

import { encodedAuditPathToSubgraph } from './encodedAuditPathToSubgraph'

import { wrapForMarkdown } from './wrapForMarkdown'
import { objectToSaltGraph } from './objectToSaltGraph'
import { inclusionProof } from './inclusionProof'
import { fullTreeObjectToFullTreeGraph } from './fullTreeObjectToFullTreeGraph'

import { basicTree } from './basicTree'
import { defaults } from './defaults'


const MerkleMermaid = { defaults, graphToMermaid, encodedAuditPathToSubgraph, wrapForMarkdown, objectToSaltGraph, inclusionProof, fullTreeObjectToFullTreeGraph, basicTree };

export default MerkleMermaid