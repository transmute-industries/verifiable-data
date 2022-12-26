import fs from "fs";
import MerkleMermaid from "../../mermaid-representation";

it("custom tree styles", () => {
  const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
  const options: any = {
    nodeStyle: (n: any) => {
      if (n.isRoot) {
        return `\t\t${n.id}("ROOT")
\t\t\tstyle ${n.id} stroke: red, stroke-width: 2.0px
`;
      } else if (n.isLeaf) {
        return `\t\t${n.id}("LEAF")
\t\t\tstyle ${n.id} stroke: green, stroke-width: 2.0px
`;
      } else {
        return `\t\t${n.id}("${n.label}")\n`;
      }
    },
    linkStyle: (e: any, i: number) => {
      if (
        e.target ===
        "c478fead0c89b79540638f844c8819d9a4281763af9272c7f3968776b6052345"
      ) {
        return `\t\t${e.source} -- Hey Cool --> ${e.target}
\t\t\tlinkStyle ${i} color: orange, stroke: purple, stroke-width: 3.0px
`;
      } else {
        return `\t\t${e.source} -.-> ${e.target} \n`;
      }
    }
  };
  const fullTreeMermaid = MerkleMermaid.basicTree(members, options);
  fs.writeFileSync(
    "./src/mermaid-representation/__tests__/custom.tree.mermaid.md",
    fullTreeMermaid
  );
});
