import fs from 'fs'

import JsonMerkleTree from '../../json-representation'
import MerkleMermaid from '../../mermaid-representation';

it('view a full tree as inclusion proofs', () => {
  const members = ['0', '1', '2', '3', '4', '5', '6', '7'].map(Buffer.from)
  const fullTreeObject = JsonMerkleTree.from(members)
  const mermaidView = MerkleMermaid.inclusionProof(fullTreeObject, [3])
  fs.writeFileSync('./src/mermaid-representation/__tests__/inclusion.proof.no-salt.mermaid.md', mermaidView )
})