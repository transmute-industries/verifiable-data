import { graphToMermaid } from "./graphToMermaid";

import { encodedAuditPathToSubgraph } from "./encodedAuditPathToSubgraph";

import { wrapForMarkdown } from "./wrapForMarkdown";

import { inclusionProof } from "./inclusionProof";
import { fullTreeObjectToFullTreeGraph } from "./fullTreeObjectToFullTreeGraph";

import { basicTree } from "./basicTree";
import { defaults } from "./defaults";

const MerkleMermaid = {
  defaults,
  graphToMermaid,
  encodedAuditPathToSubgraph,
  wrapForMarkdown,
  inclusionProof,
  fullTreeObjectToFullTreeGraph,
  basicTree
};

export default MerkleMermaid;
