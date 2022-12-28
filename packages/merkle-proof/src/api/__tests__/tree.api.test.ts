import merkle from "../..";

const members = ["0", "1", "2", "3", "4", "5", "6", "7"].map(Buffer.from);

const tree = merkle.tree.from(members);
const member = members[3];

describe("merkle tree", () => {
  it("valid proof", () => {
    const { targetHash, proof, root } = merkle.tree.proof.create(tree, member);
    const valid = merkle.tree.proof.verify(targetHash, proof, root);
    expect(tree.length).toBe(4);
    expect(proof.length).toBe(3);
    expect(valid).toBe(true);
  });

  it("invalid proof", () => {
    expect.assertions(1);
    const member = Buffer.from("8");
    expect(() => {
      merkle.tree.proof.create(tree, member);
    }).toThrow("Cannot produce proof, the value is not included in the tree.");
  });

  it("non member proof", () => {
    const { proof, root } = merkle.tree.proof.create(tree, member);
    const nonMember = Buffer.from("8");
    const targetHash = merkle.util.BinaryMerkleTree.sha256(nonMember);
    const invalid = merkle.tree.proof.verify(targetHash, proof, root);
    expect(invalid).toBe(false);
  });
});
