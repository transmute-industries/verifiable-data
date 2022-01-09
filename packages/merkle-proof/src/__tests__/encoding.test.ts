import {
  computeTree,
  generateProof,
  validateProof,
  encodeProof,
  decodeProof,
  sha256
} from "..";

const interestingRanges = [1, 7, 8, 9, 256, 4096];

const checkProof = (
  targetIndex: number,
  members: Buffer[],
  tree: Buffer[][],
  root: Buffer
) => {
  if (targetIndex >= 0 && targetIndex <= members.length - 1) {
    const targetMember = Buffer.from(members[targetIndex]);
    const proof: any = generateProof(targetMember, tree);
    const isProofValid = validateProof(targetMember, proof, root);
    expect(isProofValid).toBe(true);
    const nonce = sha256(Buffer.from("nonce"));
    const encodedProof = encodeProof(proof, nonce);
    const decodedProof = decodeProof(encodedProof);
    expect(decodedProof.auditPath).toEqual(proof);
    expect(decodedProof.nonce).toEqual(nonce);
  }
};

interestingRanges.forEach(membershipSetLength => {
  it(`can represent proofs of size ${membershipSetLength}`, () => {
    const members = Array.from({ length: membershipSetLength }, (_x, i) =>
      Buffer.from(i.toString())
    );
    const tree = computeTree(members);
    const root = tree[0][0] || null;
    const targetIndexes: number[] = [
      0, // start
      1, // close to start
      Math.ceil(members.length / 2) - 1, // near the middle
      Math.ceil(members.length / 2), // somewhere in the middle
      Math.ceil(members.length / 2) + 1, // near the middle
      members.length - 2, // close to end
      members.length - 1 // end
    ];
    targetIndexes.forEach(targetIndex => {
      checkProof(targetIndex, members, tree, root);
    });
  });
});
