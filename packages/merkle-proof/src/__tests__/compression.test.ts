import {
  sha256,
  generateMembership,
  compressDisclosureProof,
  expandDisclosureProof,
  deriveMembershipProof,
  verifyMembershipProof,
  FullDisclosureProof,
  SelectiveDisclosureProof
} from "..";

const interestingRanges = [1, 7, 8, 9];

const nonce = sha256(Buffer.from("nonce"));

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

const checkCompression = (targetIndex: number, members: Buffer[]) => {
  if (targetIndex >= 0 && targetIndex <= members.length - 1) {
    // can compress full disclosure proofs
    const mp = generateMembership(members, nonce, sha256);
    verifyMembers(members, mp);
    const cp = compressDisclosureProof(mp);
    const ep = expandDisclosureProof(cp);
    const membersMatchingProofs = ep.membership.map((m: any, i: any) => {
      return {
        member: mp.membership[i].member,
        proof: m.proof
      };
    });
    expect(mp).toEqual({ ...ep, membership: membersMatchingProofs });
    const oddMembers = members.filter((_m, i) => {
      return i % 2 === 1;
    });
    // can compress selective disclosure proofs
    const derived = deriveMembershipProof(mp, oddMembers);
    const cp2 = compressDisclosureProof(derived);
    const ep2 = expandDisclosureProof(cp2);
    const membersMatchingProofs2 = ep2.membership.map((m: any, i: any) => {
      return {
        member: derived.membership[i].member,
        proof: m.proof
      };
    });
    expect(derived).toEqual({ ...ep2, membership: membersMatchingProofs2 });
    verifyMembers(oddMembers, derived);
  }
};

interestingRanges.forEach(membershipSetLength => {
  it(`can compress and decompress proofs of size ${membershipSetLength}`, () => {
    const members = Array.from({ length: membershipSetLength }, (_x, i) =>
      Buffer.from(i.toString())
    );
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
      checkCompression(targetIndex, members);
    });
  });
});
