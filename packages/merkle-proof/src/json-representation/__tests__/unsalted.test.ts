import fs from "fs";
import JsonMerkleTree from "..";

it("unsalted tree and proof as json", () => {
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const tree = JsonMerkleTree.from(members);
  const valid1 = JsonMerkleTree.validate(tree);
  expect(valid1).toBe(true);
  fs.writeFileSync(
    "./examples/unsalted.tree.json",
    JSON.stringify(tree, null, 2)
  );
  const proof = JsonMerkleTree.reveal(tree, [3]);
  fs.writeFileSync(
    "./examples/unsalted.proof.json",
    JSON.stringify(proof, null, 2)
  );
  const valid2 = JsonMerkleTree.validate(proof);
  expect(valid2).toBe(true);
});
