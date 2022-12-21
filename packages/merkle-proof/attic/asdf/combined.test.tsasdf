

import fs from "fs";

import TMT from "..";

import Mermaid from '../Mermaid';

const list: Buffer[] = Array.from({ length: 8 }, (_x, i) =>
  Buffer.from(`${i}`)
);

it("Binary Merkle Tree with Audit Path", () => {
  const treeObject = TMT.create(list);
  fs.writeFileSync('./examples/combined/tree.obj.json', JSON.stringify(treeObject, null, 2))
  const proofObject  = TMT.obj(TMT.derive(TMT.urn(treeObject), [3])) ;
  fs.writeFileSync('./examples/combined/proof.obj.json', JSON.stringify(proofObject, null, 2))
  const g0 = TMT.objectToBinaryMerkelTree(treeObject)
  fs.writeFileSync('./examples/combined/tree.autograph.json', JSON.stringify(g0, null, 2))
  const g1 = TMT.objectToAutograph(proofObject)
  fs.writeFileSync('./examples/combined/proof.autograph.json', JSON.stringify(g1, null, 2))
  const g2 = TMT.addMerkleTreeAutographToMerkleProofAutograph(g0, g1)
  fs.writeFileSync('./examples/combined/combined.autograph.json', JSON.stringify(g2, null, 2))
  const mermaid = Mermaid.merkleTreeFromAutograph(g2);
  fs.writeFileSync('./examples/combined/combined.mermaid.md', mermaid)  
});