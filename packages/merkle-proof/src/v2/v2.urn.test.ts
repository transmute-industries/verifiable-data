import { TMT } from "./TMT";

import fs from "fs";

const list: Buffer[] = Array.from({ length: 8 }, (_x, i) =>
  Buffer.from(`${i}`)
);

let fullTreeUrn: string;
let fullTreeObj: any;
let fullTreeMermaid: string;

let singleProofUrn: string;
let singleProofObj: any;
let singleProofMermaid: string;

let combinedMermaid: string;

const obj = TMT.create(list);

describe("merkle tree", () => {
  it("verify paths from all leaves", () => {
    fullTreeObj = obj;
    const allItems = TMT.urn(obj);
    const allValid = TMT.verify(allItems);
    expect(allValid).toBe(true);
  });

  it("verify paths from all odd leaves", () => {
    const allItems = TMT.urn(obj);
    const oddItems = TMT.derive(allItems, [1, 3, 5, 7]);
    const oddValid = TMT.verify(oddItems);
    expect(oddValid).toBe(true);
  });

  it("verify a single proof", () => {
    const allItems = TMT.urn(obj);
    singleProofUrn = TMT.derive(allItems, [3]);
    const member = TMT.member(obj.members[3], obj.salts[3]);
    const isValid = TMT.verify(singleProofUrn, member);
    expect(isValid).toBe(true);
    fullTreeUrn = allItems;
    fullTreeMermaid = TMT.mermaid(allItems);
    singleProofMermaid = TMT.mermaid(singleProofUrn);
    singleProofObj = TMT.obj(singleProofUrn);
    combinedMermaid = TMT.review(fullTreeUrn, singleProofUrn);
  });
});

afterAll(() => {
  fs.writeFileSync(
    "merkle-tree.md",
    `## Merkel Tree URN
\`\`\`
${fullTreeUrn}
\`\`\`

## Merkel Tree Object
\`\`\`json
${JSON.stringify(fullTreeObj, null, 2)}
\`\`\`

## Merkel Tree Mermaid
${fullTreeMermaid}

`
  );

  fs.writeFileSync(
    "merkle-proof.md",
    `## Merkel Proof URN
\`\`\`
${singleProofUrn}
\`\`\`

## Merkel Tree Object
\`\`\`json
${JSON.stringify(singleProofObj, null, 2)}
\`\`\`

## Merkel Proof Mermaid
${singleProofMermaid}
`
  );

  fs.writeFileSync(
    "merkle-combined.md",
    `## Merkel Proof Review
${combinedMermaid}
`
  );
});
