import {
  generateMembership,
  verifyMembershipProof,
  deriveMembershipProof,
  FullDisclosureProof,
  SelectiveDisclosureProof,
  sha256
} from "..";

const membershipSetLength = 16;
const members = Array.from({ length: membershipSetLength }, (_x, i) =>
  Buffer.from(i.toString())
);
const rootNonce = sha256(Buffer.from("123", "hex"));

const verifyMembers = (
  members: Buffer[],
  proof: FullDisclosureProof | SelectiveDisclosureProof
) => {
  let valid = true;
  members.forEach((m, i) => {
    // make sure the member is in the proof
    expect(proof.membership[i].member).toEqual(m);
    const v = verifyMembershipProof(
      proof.membership[i].member,
      proof.membership[i].proof,
      proof.root
    );
    // keep accumulating validations
    valid = valid || v;
  });
  // all members are in the proof
  expect(valid).toBe(true);
};

describe("merkle proof", () => {
  describe("full disclosure membership proof", () => {
    it("should prove membership for all member", () => {
      const proof = generateMembership(members, rootNonce);
      expect(proof.root).toBeDefined();
      expect(proof.nonce).toBeDefined();
      expect(proof.membership).toBeDefined();
      verifyMembers(members, proof);
    });
  });
  describe("selective disclosure membership proof", () => {
    it("should derive and prove membership for all odd members", () => {
      const fullMembershipProof = generateMembership(members, rootNonce);
      const oddMembers = members.filter((_m, i) => {
        return i % 2 === 1;
      });
      const proof = deriveMembershipProof(fullMembershipProof, oddMembers);
      expect(proof.root).toBeDefined();
      expect(proof.membership).toBeDefined();
      verifyMembers(oddMembers, proof);
    });
  });
});
