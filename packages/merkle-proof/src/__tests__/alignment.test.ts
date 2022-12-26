import fs from 'fs'
import BinaryMerkleTree from '../binary-merkle-tree'
import MerkleMermaid from '../mermaid-representation';

it('data structures match', () => {
  const seed = Buffer.from('hello')
  const members = ['0', '1', '2', '3', '4', '5', '6', '7'].map(Buffer.from)
  const salts = members.map((_m, i)=>{
    return BinaryMerkleTree.generateSalt({seed, index: i})
  })
  const saltedMembers  = members.map((m, i)=>{
    return BinaryMerkleTree.concatValues([m, salts[i]]);
  })
  const tree = BinaryMerkleTree.computeTree(saltedMembers);
  const g = BinaryMerkleTree.encodeTreeAsGraph(tree)
  const m = MerkleMermaid.graphToMermaid(g)
  fs.writeFileSync('./examples/alignment/full-tree.mermaid.md', m)

  
})