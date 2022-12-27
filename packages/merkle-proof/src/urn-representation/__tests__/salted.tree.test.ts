import fs from "fs";
import MerkleUrn from "..";

it("salted merkle tree as urn", () => {
  const seed = Buffer.from("hello");
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const urn = MerkleUrn.basicTree(members, seed);
  const valid = MerkleUrn.validate(urn);
  expect(valid).toBe(true)
  fs.writeFileSync(
    "./src/urn-representation/__tests__/salted.tree.json",
    JSON.stringify({ urn }, null, 2)
  );
});
