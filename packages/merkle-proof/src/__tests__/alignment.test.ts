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

  const saltedMembers  = members.map((m, i)=>{
    return BinaryMerkleTree.concatValues([m, salts[i]]);
  })

  // this stuff needs to come from higher order objects
  const tree = BinaryMerkleTree.computeTree(saltedMembers);

  const fullTreeGraph = BinaryMerkleTree.encodeTreeAsGraph(tree)
  const fullTreeMermaid = MerkleMermaid.graphToMermaid(fullTreeGraph, {header: true, markdown: true})
  const fullTreeObject = JsonMerkleTree.from(members, { salts })

  fs.writeFileSync('./examples/alignment/full-tree.graph.json', JSON.stringify(fullTreeGraph, null, 2))
  fs.writeFileSync('./examples/alignment/full-tree.mermaid.md', fullTreeMermaid)
  fs.writeFileSync('./examples/alignment/full-tree.obj.json', JSON.stringify(fullTreeObject, null, 2))
  
  // these should be moved to presentation layer functions of higher order objects
  const saltGraph = MerkleMermaid.objectToSaltGraph(fullTreeObject);
  const auditPathGraph = MerkleMermaid.encodedAuditPathToSubgraph(fullTreeObject.leaves[0], fullTreeObject.paths[0], fullTreeObject.root)
  const mermaidMultigraph = MerkleMermaid.fromGraphs([saltGraph, fullTreeGraph, auditPathGraph])
  fs.writeFileSync('./examples/alignment/full-tree.subg.mermaid.md', MerkleMermaid.wrapForMarkdown(mermaidMultigraph) )

})