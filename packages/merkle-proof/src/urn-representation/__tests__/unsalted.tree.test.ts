import fs from "fs";
import MerkleUrn from "..";

it("unsalted merkle tree as urn", () => {
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const urn = MerkleUrn.basicTree(members);
  const valid = MerkleUrn.validate(urn);
  expect(valid).toBe(true)
  fs.writeFileSync(
    "./src/urn-representation/__tests__/unsalted.tree.json",
    JSON.stringify({ urn }, null, 2)
  );
});
