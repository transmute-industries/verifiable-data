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
  const fullTreeGraph = MerkleMermaid.fullTreeObjectToFullTreeGraph(fullTreeObject)
  const fullTreeMermaid = MerkleMermaid.graphToMermaid(fullTreeGraph, { header: true, markdown: true, style: 'none'})
  
  fs.writeFileSync('./examples/alignment/full-tree.obj.json', JSON.stringify(fullTreeObject, null, 2))
  fs.writeFileSync('./examples/alignment/full-tree.graph.json', JSON.stringify(fullTreeGraph, null, 2))
  fs.writeFileSync('./examples/alignment/full-tree.mermaid.md', fullTreeMermaid)
  
})