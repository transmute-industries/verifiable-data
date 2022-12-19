import {
  computeTree,
  generateProof,
  validateProof,
  encodeProofAsObject,
  encodeTreeAsUrn,
  encodeTreeAsObject,
  encodeProofAsUrn,
  addProofToTree,
  validateProofUrn,
  proofUrnToJson,
  treeUrnToJson,
  generateSalt,
  addSaltsToMembers,
  saltMember,
  MerkleTree
} from ".";

import autographToMermaid from "./autographToMermaid";

import fs from "fs";

const members: Buffer[] = Array.from({ length: 8 }, (_x, i) =>
  Buffer.from(i.toString())
);
const member: Buffer = members[3];
const tree = computeTree(members);
const root = tree[0][0];

it("preview tree", () => {
  const autograph = encodeTreeAsObject(tree);
  fs.writeFileSync(
    "./src/v2/examples/merkle-tree.mermaid.md",
    autographToMermaid(autograph, { style: "subtle" })
  );
  const treeUrn = encodeTreeAsUrn(tree);
  fs.writeFileSync(
    "./src/v2/examples/merkle-tree.urn.md",
    `\`\`\`url\n${treeUrn}\n\`\`\``
  );
  const treeJson = treeUrnToJson(treeUrn);
  fs.writeFileSync("./src/v2/examples/merkle-tree.urn.json", treeJson);
});

describe("proof", () => {
  it("validateProof", () => {
    const proof = generateProof(member, tree);
    expect(validateProof(member, proof, root)).toBe(true);
  });

  it("encodeProofAsUrn", () => {
    const proof = generateProof(member, tree);
    const proofUrn = encodeProofAsUrn(root, proof, member);
    expect(validateProofUrn(proofUrn, member)).toBe(true);
    fs.writeFileSync(
      "./src/v2/examples/merkle-proof.urn.md",
      `\`\`\`url\n${proofUrn}\n\`\`\``
    );
  });

  it("proofUrnToJson", () => {
    const proof = generateProof(member, tree);
    const proofUrn = encodeProofAsUrn(root, proof, member);
    const proofJson = proofUrnToJson(proofUrn);
    fs.writeFileSync("./src/v2/examples/merkle-proof.urn.json", proofJson);
  });

  it("mermaid", () => {
    const proof = generateProof(member, tree);
    const autograph = encodeProofAsObject(root, proof, member);
    fs.writeFileSync(
      "./src/v2/examples/merkle-proof.mermaid.md",
      autographToMermaid(autograph)
    );
  });
});

it("preview tree & proof in mermaid", () => {
  const treeGraph = encodeTreeAsObject(tree);
  const proof = generateProof(member, tree);
  const proofGraph = encodeProofAsObject(root, proof, member);
  const combinedGraph = addProofToTree(treeGraph, proofGraph);
  fs.writeFileSync(
    "./src/v2/examples/merkle-tree-with-proof.mermaid.md",
    autographToMermaid(combinedGraph)
  );
});

it("nicer api", () => {
  const merkleTree = MerkleTree.from(members);
  const proofUrn = merkleTree.getProofUrn(member);
  const valid = MerkleTree.validateProofUrn(proofUrn, member);
  expect(valid).toBe(true);
  const g0 = MerkleTree.autograph.raw.tree(members);
  fs.writeFileSync(
    "./src/v2/examples/merkle-tree.autograph.json",
    JSON.stringify(g0, null, 2)
  );

  const proof = generateProof(member, tree);
  const g1 = MerkleTree.autograph.raw.proof(root, proof, member);
  fs.writeFileSync(
    "./src/v2/examples/merkle-proof.autograph.json",
    JSON.stringify(g1, null, 2)
  );

  const g2 = MerkleTree.autograph.urn.tree(merkleTree.urn);
  fs.writeFileSync(
    "./src/v2/examples/merkle-tree.autograph.g2.json",
    JSON.stringify(g2, null, 2)
  );

  const g3 = MerkleTree.autograph.urn.proof(proofUrn);
  fs.writeFileSync(
    "./src/v2/examples/merkle-proof.autograph.g3.json",
    JSON.stringify(g3, null, 2)
  );
});


describe('selective disclosure', ()=> {
  it('trivial example', ()=> {
    const salts = members.map(generateSalt)
    const saltedMembers = addSaltsToMembers(members, salts)
    const saltedMember = saltedMembers[3]
    const tree = computeTree(saltedMembers)
    const proof = generateProof(saltedMember, tree);
    const valid = validateProof(saltMember(members[3], salts[3]), proof, tree[0][0])
    expect(valid).toBe(true)
  })

  it.only('nicer api', ()=> {
    const disclosureUrn = MerkleTree.disclosure.urn.generate(members);
    const disclosureUrn2 = MerkleTree.disclosure.urn.derive(disclosureUrn, [2, 3, 4]);
    const valid =  MerkleTree.disclosure.urn.verify(disclosureUrn2);
    expect(valid).toBe(true)
  })
})