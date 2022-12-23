import fs from 'fs'
import JsonMerkleTree from '../../json-representation'
import MerkleGraph from '..'
import MerkleMermaid from '../../mermaid-representation'

it('no salt', () => {
  const members = ['0', '1', '2', '3', '4', '5', '6', '7'].map(Buffer.from)
  const tree = JsonMerkleTree.from(members, { salt: false });
  const graph = MerkleGraph.merkleTreeObjectToGraph(tree,  { hypergraph: true })
  const mermaid = MerkleMermaid.graphToMermaid(graph)
  fs.writeFileSync('./examples/graph/tree.no-salt.graph.json', JSON.stringify(graph, null, 2))
  fs.writeFileSync('./examples/graph/tree.no-salt.mermaid.md', mermaid)
  const proof = JsonMerkleTree.reveal(tree, [3])
  fs.writeFileSync('./examples/graph/proof.no-salt.graph.json', JSON.stringify(proof, null, 2))
  const valid = JsonMerkleTree.validate(proof);
  expect(valid).toBe(true)
})