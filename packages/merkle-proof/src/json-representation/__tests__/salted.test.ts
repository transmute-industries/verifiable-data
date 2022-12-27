import fs from "fs";
import JsonMerkleTree from "..";

it("salted tree and proof as json", () => {
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const salts = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const tree = JsonMerkleTree.from(members, { salts });
  const valid1 = JsonMerkleTree.validate(tree);
  expect(valid1).toBe(true);
  fs.writeFileSync("./examples/salted.tree.json", JSON.stringify(tree, null, 2));
  const proof = JsonMerkleTree.reveal(tree, [3]);
  fs.writeFileSync("./examples/salted.proof.json", JSON.stringify(proof, null, 2));
  const valid2 = JsonMerkleTree.validate(proof);
  expect(valid2).toBe(true);
});
