import fs from 'fs'
import BinaryMerkleTree from '../binary-merkle-tree'
import MerkleMermaid from '../mermaid-representation';
import JsonMerkleTree from '../json-representation'

it('data structures match', () => {
  const seed = Buffer.from('hello')
  const members = ['0', '1', '2', '3', '4', '5', '6', '7'].map(Buffer.from)

  const salts = members.map((_m, i)=>{
    return BinaryMerkleTree.generateSalt({seed, index: i})
  })

  const fullTreeObject = JsonMerkleTree.from(members, { salts })

  const view = MerkleMermaid.inclusionProof(fullTreeObject, 0);
  
  fs.writeFileSync('./examples/alignment/inclusion-proof.mermaid.md', MerkleMermaid.wrapForMarkdown(view) )

})