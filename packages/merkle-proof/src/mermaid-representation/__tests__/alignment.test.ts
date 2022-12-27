import fs from "fs";
import BinaryMerkleTree from "../../binary-merkle-tree";
import MerkleMermaid from "..";
import JsonMerkleTree from "../../json-representation";

it("data structure alignment", () => {
  const seed = Buffer.from("hello");
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const salts = BinaryMerkleTree.getSaltsForMembers(members, seed)
  const fullTreeObject = JsonMerkleTree.from(members, { salts });
  const fullTreeGraph = MerkleMermaid.fullTreeObjectToFullTreeGraph(
    fullTreeObject
  );
  const options: any = {
    header: true,
    markdown: true,
    style: "none",
    linkStyle: MerkleMermaid.defaults.linkStyle,
    nodeStyle: MerkleMermaid.defaults.nodeStyle
  };
  const fullTreeMermaid = MerkleMermaid.graphToMermaid(fullTreeGraph, options);
  fs.writeFileSync(
    "./src/mermaid-representation/__tests__/full-tree.obj.json",
    JSON.stringify(fullTreeObject, null, 2)
  );
  fs.writeFileSync(
    "./src/mermaid-representation/__tests__/full-tree.graph.json",
    JSON.stringify(fullTreeGraph, null, 2)
  );
  fs.writeFileSync(
    "./src/mermaid-representation/__tests__/full-tree.mermaid.md",
    fullTreeMermaid
  );
});
