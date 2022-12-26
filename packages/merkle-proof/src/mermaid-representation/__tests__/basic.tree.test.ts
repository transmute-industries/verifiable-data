import fs from 'fs'
import MerkleMermaid from '../../mermaid-representation';

it('basic unstyled binary merkle tree', () => {
  const members = ['0', '1', '2', '3', '4', '5', '6', '7'].map(Buffer.from)
  const fullTreeMermaid = MerkleMermaid.basicTree(members)
  fs.writeFileSync('./src/mermaid-representation/__tests__/basic.tree.mermaid.md', fullTreeMermaid)
})