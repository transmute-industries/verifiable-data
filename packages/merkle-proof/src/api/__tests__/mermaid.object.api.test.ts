import fs from  'fs'
import merkle from "../..";

const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);
const seed = Buffer.from("hello");
const salts = merkle.salt.from(members, seed);

describe("merkle mermaid urn", () => {
  it("various diagrams", () => {
    const treeObject = merkle.object.create({ members, salts });
    const m0 = merkle.mermaid.object({ proof: treeObject });
    const proofObject = merkle.object.reveal({proof:treeObject,  reveal: [3] })
    const m1 = merkle.mermaid.object({ proof: proofObject });
    const m2 = merkle.mermaid.object({ proof: proofObject, value: members[3], salt: salts[3] });
    const m3 = merkle.mermaid.object({ proof: proofObject, value: members[3], salt: salts[3] });
    const file = `# Merkle Mermaid Object
# Tree
\`\`\`
${JSON.stringify(treeObject, null, 2)}
\`\`\`
${m0}
# Proof
\`\`\`
${JSON.stringify(proofObject, null, 2)}
\`\`\`
${m1}
# Tree with Member
${m2}
# Proof with Member
${m3}
`
    fs.writeFileSync('./src/api/__tests__/mermaid.object.md', file)
  });
});
