

import fs from "fs";

import TMT from "..";

import Mermaid from '../Mermaid';

const list: Buffer[] = Array.from({ length: 8 }, (_x, i) =>
  Buffer.from(`${i}`)
);

it("Binary Merkle Tree", () => {
  const obj = TMT.create(list);
  fs.writeFileSync('./examples/tree.obj.json', JSON.stringify(obj, null, 2))
  const autograph = TMT.objectToBinaryMerkelTree(obj);
  fs.writeFileSync('./examples/tree.autograph.json', JSON.stringify(autograph, null, 2))
  const mermaid = Mermaid.merkleTreeFromAutograph(autograph);
  fs.writeFileSync('./examples/tree.mermaid.md', mermaid)
  const urn = TMT.urn(obj);
  fs.writeFileSync('./examples/tree.urn.md', urn)
  const autograph2 = TMT.objectToAutograph(obj);
  fs.writeFileSync('./examples/tree.proofs.autograph.json', JSON.stringify(autograph2, null, 2))
  const mermaid2 = Mermaid.merkleTreeFromAutograph(autograph2);
  fs.writeFileSync('./examples/tree.proofs.mermaid.md', mermaid2)
});