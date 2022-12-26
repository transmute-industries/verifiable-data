import { graphToMermaid } from './graphToMermaid'
import { objectToMermaid } from './objectToMermaid'
import { encodedAuditPathToSubgraph } from './encodedAuditPathToSubgraph'
import { fromGraphs } from './fromGraphs'
import { wrapForMarkdown } from './wrapForMarkdown'

const MerkleMermaid = { graphToMermaid, objectToMermaid, encodedAuditPathToSubgraph, fromGraphs, wrapForMarkdown };

export default MerkleMermaid