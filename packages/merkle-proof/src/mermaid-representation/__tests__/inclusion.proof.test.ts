import fs from "fs";

import BinaryMerkleTree from "../../binary-merkle-tree";
import JsonMerkleTree from "../../json-representation";
import MerkleMermaid from "../../mermaid-representation";

it("view a full tree as inclusion proofs", () => {
  const seed = Buffer.from("hello");
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const salts = BinaryMerkleTree.getSaltsForMembers(members, seed);
  const fullTreeObject = JsonMerkleTree.from(members, { salts });

  const valid1 = JsonMerkleTree.validate(fullTreeObject);
  expect(valid1).toBe(true);

  const targetMember = members[0];
  const targetSalt = salts[0];

  const mermaidView = MerkleMermaid.inclusionProof(
    fullTreeObject,
    targetMember,
    targetSalt
  );

  fs.writeFileSync(
    "./src/mermaid-representation/__tests__/inclusion.proof.mermaid.md",
    mermaidView
  );
});
