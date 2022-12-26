import fs from "fs";
import JsonMerkleTree from "..";

it("simple", () => {
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const tree = JsonMerkleTree.from(members);
  fs.writeFileSync("./examples/tree.json", JSON.stringify(tree, null, 2));
  const proof = JsonMerkleTree.reveal(tree, [3]);
  fs.writeFileSync("./examples/proof.json", JSON.stringify(proof, null, 2));
  const valid = JsonMerkleTree.validate(proof);
  expect(valid).toBe(true);
});
