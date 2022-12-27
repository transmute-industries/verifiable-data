import fs from "fs";
import MerkleUrn from "..";

it("unsalted merkle tree as urn", () => {
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const treeUrn = MerkleUrn.basicTree(members);
  const valid1 = MerkleUrn.validate(treeUrn);
  expect(valid1).toBe(true)

  const proofUrn = MerkleUrn.reveal(treeUrn, [3])
  const valid2 = MerkleUrn.validate(proofUrn);
  expect(valid2).toBe(true)

  fs.writeFileSync(
    "./src/urn-representation/__tests__/unsalted.tree.json",
    JSON.stringify({ treeUrn, proofUrn }, null, 2)
  );
});
