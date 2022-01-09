# @transmute/merkle-proof

```
npm i @transmute/merkle-proof --save
```

This library is designed to be used as a building block for systems that rely on merkle proofs.

There is currently no standard binary encoding for merkle proof, audit paths, deterministic nonce generation and member salting to prevent second preimage attacks.

As such standards are developed we will update this library to meet those specifications.

Specifically this library does not currently encode a JSON serialization.

## Usage

```ts
import merkle from "@transmute/merkle-proof";
const membershipSetLength = 16;
const members = Array.from(
  { length: membershipSetLength },
  (_x, i) => Buffer.from(i.toString()) // members are integers encoded as strings
);
// this value is used to protect against brute force attacks on siblings
const rootNonce = Buffer.from("123", "hex");
const fullMembershipProof = merkle.generateMembership(members, rootNonce);
const verifiedFullDisclosureProof = merkle.verifyMembershipProof(
  fullMembershipProof.membership[i].member,
  fullMembershipProof.membership[i].proof,
  fullMembershipProof.root
);
const oddMembers = members.filter((_m, i) => {
  return i % 2 === 1;
});
const selectiveDisclosureProof = merkle.deriveMembershipProof(
  fullMembershipProof,
  oddMembers
);
const verifiedSelectiveDisclosureProof = merkle.verifyMembershipProof(
  verifiedSelectiveDisclosureProof.membership[i].member,
  verifiedSelectiveDisclosureProof.membership[i].proof,
  verifiedSelectiveDisclosureProof.root
);
```

### Custom Hash Functions

By default, sha256 is used, however, a custom hash function may be specified.
Please ensure its function signature matches sha256.
Also note that the size of `nonce` is expected to be determined by the size
of the digests of this function in bytes.

```ts
import {
  generateMembership,
  compressDisclosureProof,
  expandDisclosureProof,
  MemberProof,
} from "@transmute/merkle-proof";

// default hash function when none is specified
const sha256 = (data: Buffer): Buffer => {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest();
};

const rootNonce = sha256(Buffer.from("entropy sourced for single use"));

const fullMembershipProof = generateMembership(members, rootNonce, sha256);
```

### Compression

Selective disclosure proofs that rely on merkle audit paths contain a lot of redundant information, especially when the redaction set (number of undisclosed members) is small.

This redundancy can be easily mitigated through compression algorithms, we use zlib v1.2.8.

Beware that compression trades storage costs for computational costs and time.

```ts
import {
  generateMembership,
  compressDisclosureProof,
  expandDisclosureProof,
  MemberProof,
} from "@transmute/merkle-proof";
const fullMembershipProof = generateMembership(members, rootNonce);
// redaction set size 0 for full disclosure.
const compressedFullDisclosureProof = compressDisclosureProof(
  fullMembershipProof
);
const expandedFullDisclosureProof = expandDisclosureProof(
  compressedFullDisclosureProof
);
// compression is not applied to members, only sets of audit paths.
// therefore we must add members back to the decompressed proofs
// before asserting equivalence, note this behavior is subject to change,
// and is based on planned suport for digital signatures in other libraries
const membersMatchingProofs = expandedFullDisclosureProof.membership.map(
  (m: MemberProof, i: number) => {
    return {
      member: fullMembershipProof.membership[i].member,
      proof: m.proof,
    };
  }
);
expect(fullMembershipProof).toEqual({
  ...expandedFullDisclosureProof,
  membership: membersMatchingProofs,
});
```

### Development

```
npm i
npm run lint
npm run test
npm run build
```

### Inspiration

- [settlemint/merkle-tools](https://github.com/settlemint/merkle-tools) - we maintain interop tests with this library.
- [RFC9162 - Certificate Transparency Version 2.0](https://datatracker.ietf.org/doc/html/rfc9162)
- [Certificate Transparency](https://datatracker.ietf.org/doc/html/rfc6962)
- [google/trillian](https://github.com/google/trillian)
- [verkle-trees, and background on k-ary Merkle Trees](https://math.mit.edu/research/highschool/primes/materials/2018/Kuszmaul.pdf)
- [Potential future work: Vector Commitments and their Applications](https://eprint.iacr.org/2011/495.pdf)
