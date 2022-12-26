import fs from "fs";

import BinaryMerkleTree from "../../binary-merkle-tree";
import JsonMerkleTree from "../../json-representation";
import MerkleMermaid from "../../mermaid-representation";

it("view a full tree as inclusion proofs", () => {
  const seed = Buffer.from("hello");
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const salts = members.map((_m, i) => {
    return BinaryMerkleTree.generateSalt({ seed, index: i });
  });
  const fullTreeObject = JsonMerkleTree.from(members, { salts });
  const mermaidView = MerkleMermaid.inclusionProof(fullTreeObject, [0]);
  fs.writeFileSync(
    "./src/mermaid-representation/__tests__/inclusion.proof.mermaid.md",
    mermaidView
  );
});
