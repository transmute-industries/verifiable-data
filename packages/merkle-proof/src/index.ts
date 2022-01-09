import crypto from "crypto";
import varint from "varint";
import { Bitstring } from "@transmute/compressable-bitstring";
import pako from "pako";

const branchingFactor = 2;
// beware that attempting to improve merkle proofs by adjusting this value
// is not going to help you.
// see k-branching merkle proofs for details.

enum SiblingPosition {
  left = "left",
  right = "right"
}

type Sibling = {
  [SiblingPosition.left]?: Buffer;
  [SiblingPosition.right]?: Buffer;
};

type MerkleAuditPath = Array<Sibling>;

type InternalProof = {
  nonce: Buffer;
  auditPath: MerkleAuditPath;
};

type BinaryAuditPathAndNonce = Buffer;
// this is binary packed proof containing:
// numberOfAuditHashesProofs, auditDirectionsAsBits, memberNonce, auditHashes,

type BinaryDisclosureProof = Buffer;
// this is binary packed proof containing:
// number of members, ,

export type MemberProof = {
  member: Buffer; // this is the message
  proof: BinaryAuditPathAndNonce;
};

export type FullDisclosureProof = {
  root: Buffer; // this is the merkle root
  nonce: Buffer; // this is the root nonce
  membership: Array<MemberProof>;
};

export type SelectiveDisclosureProof = {
  root: Buffer;
  membership: Array<MemberProof>;
};

const concatValues = (values: Buffer[]): Buffer => {
  return values.slice(1).reduce((pv: any, cv: any) => {
    return Buffer.concat([pv, cv]);
  }, values[0]);
};

export const sha256 = (data: Buffer) => {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest();
};

const unpact = (pacted: Buffer) => {
  const elements: any = [];
  while (pacted.length) {
    try {
      const elementLength = varint.decode(pacted);
      const element = pacted.slice(
        varint.decode.bytes,
        varint.decode.bytes + elementLength
      );
      elements.push(element);
      pacted = pacted.slice(varint.decode.bytes + elementLength);
    } catch (e) {
      pacted = Buffer.from("");
    }
  }
  return elements;
};

const computeNextLevel = (values: Buffer[], hash: Function) => {
  const nextLevel: Buffer[] = [];
  const clones = values.map(x => x);
  while (clones.length >= branchingFactor) {
    const group = clones.splice(0, branchingFactor);
    const groupHash = hash(concatValues(group));
    nextLevel.push(groupHash);
  }
  clones.forEach(c => {
    nextLevel.push(c);
  });
  return nextLevel;
};

const levelHasSiblingProof = (
  targetIndexInLevel: number,
  level: number,
  tree: Array<Buffer[]>
) => {
  return !(
    targetIndexInLevel === tree[level].length - 1 &&
    tree[level].length % branchingFactor === 1
  );
};

const addSiblingProof = (
  tree: Array<Buffer[]>,
  level: number,
  targetIndexInLevel: number,
  proof: Sibling[]
) => {
  const isRightNode = targetIndexInLevel % branchingFactor;
  const siblingIndex = isRightNode
    ? targetIndexInLevel - 1
    : targetIndexInLevel + 1;
  const siblingValue = tree[level][siblingIndex];
  const sibling: Sibling = isRightNode
    ? { [SiblingPosition.left]: siblingValue }
    : { [SiblingPosition.right]: siblingValue };
  proof.push(sibling);
};

const setNextTargetIndexByBranchingFactor = (targetIndexInLevel: number) => {
  return Math.floor(targetIndexInLevel / branchingFactor);
};

export const generateProof = (
  targetValue: Buffer,
  tree: Array<Buffer[]>,
  hash: Function = sha256
): Sibling[] => {
  const targetHash = hash(targetValue);
  let targetIndexInLevel = tree[tree.length - 1].findIndex(v => {
    return v.equals(targetHash);
  });
  if (targetIndexInLevel < 0) {
    return [];
  }

  const proof: Sibling[] = [];
  for (let level = tree.length - 1; level > 0; level--) {
    if (levelHasSiblingProof(targetIndexInLevel, level, tree)) {
      addSiblingProof(tree, level, targetIndexInLevel, proof);
    }
    targetIndexInLevel = setNextTargetIndexByBranchingFactor(
      targetIndexInLevel
    );
  }
  return proof;
};

export const validateProof = (
  targetValue: Buffer,
  proof: MerkleAuditPath,
  root: Buffer,
  hash: Function = sha256
): boolean => {
  const targetHash = hash(targetValue);
  if (proof.length === 0) {
    return targetHash.equals(root);
  }
  let proofHash = targetHash;
  for (const p of proof) {
    if (!p.left && !p.right) {
      return false;
    }
    if (p.left) {
      proofHash = hash(concatValues([p.left, proofHash]));
    }
    if (p.right) {
      proofHash = hash(concatValues([proofHash, p.right]));
    }
  }
  return proofHash.equals(root);
};

export const computeTree = (
  values: Buffer[],
  hash = sha256
): Array<Buffer[]> => {
  const hashedValues = values.map(hash);
  const tree = [hashedValues];
  while (tree[0].length !== 1) {
    const nextLevel = computeNextLevel(tree[0], hash);
    tree.unshift(nextLevel);
  }
  return tree;
};

export const encodeProof = (
  auditPath: MerkleAuditPath,
  memberNonce: Buffer
) => {
  const numberOfAuditHashesProofs = Buffer.concat([
    Buffer.from(varint.encode(auditPath.length)),
    Buffer.from([varint.encode.bytes.toString(16)]) // eg 0x01
  ]);
  let auditDirectionsAsBits = new Uint8Array();
  let auditHashes = Buffer.from("");
  if (auditPath.length > 0) {
    const bitstring = new Bitstring({ length: auditPath.length });
    auditPath.forEach((p: Sibling, i: number) => {
      if (p.left) {
        bitstring.set(i, false);
        auditHashes = Buffer.concat([auditHashes, p.left]);
      }
      if (p.right) {
        bitstring.set(i, true);
        auditHashes = Buffer.concat([auditHashes, p.right]);
      }
    });
    auditDirectionsAsBits = bitstring.bits;
  }

  return Buffer.concat([
    numberOfAuditHashesProofs,
    auditDirectionsAsBits,
    memberNonce,
    auditHashes
  ]);
};

export const decodeProof = (
  encoded: BinaryAuditPathAndNonce
): InternalProof => {
  const numberOfHashes = varint.decode(encoded);
  const sizeOfNumberOfHashesInBytes = varint.decode.bytes + 1;
  const directions = encoded.slice(
    sizeOfNumberOfHashesInBytes,
    sizeOfNumberOfHashesInBytes + Math.ceil(numberOfHashes / 8)
  );
  const nonceAndHashes = encoded.slice(
    sizeOfNumberOfHashesInBytes + Math.ceil(numberOfHashes / 8)
  );
  // nonce is just another hash, therefore its length is computable
  // from numberOfHashes
  // and bytes remaining

  const hashLength = nonceAndHashes.length / (numberOfHashes + 1);
  const nonce = nonceAndHashes.slice(0, hashLength);

  const auditPath = [];
  if (numberOfHashes > 0) {
    const bitstring = new Bitstring({ length: numberOfHashes });
    bitstring.bits = new Uint8Array(directions);
    const proofs = nonceAndHashes.slice(hashLength);
    for (let i = 0; i < bitstring.length; i++) {
      const sibling: any = {
        // exploiting known length of merkle root multihashes..
        [bitstring.get(i) ? "right" : "left"]: proofs.slice(
          i * hashLength,
          i * hashLength + hashLength
        )
      };
      auditPath.push(sibling);
    }
  }

  return { nonce, auditPath };
};

// in order to prevent second pre-image attacks
// a member must be salted before adding to a tree.
// so that proofs of member do not reveal information about siblings
// there are a few approaches to this, but we only implement one here.
export const calculateMessageNonce = (
  message: Buffer,
  index: number,
  rootNonce: Buffer,
  hash: Function
) => {
  const encodedIndex = Buffer.from(varint.encode(index));
  return hash(Buffer.concat([message, encodedIndex, rootNonce]));
};

export const generateMembership = (
  members: Buffer[],
  rootNonce: Buffer,
  hash: Function = sha256
): FullDisclosureProof => {
  const extendedMembers = members.map((m, i) => {
    const n = calculateMessageNonce(m, i, rootNonce, hash);
    const saltedMember = hash(Buffer.concat([m, n]));
    return { member: m, saltedMember, nonce: n };
  });
  const saltedMembers = extendedMembers.map(m => m.saltedMember);
  const tree = computeTree(saltedMembers);
  const root = tree[0][0] || null;

  const membership = saltedMembers.map((m, i) => {
    try {
      const proof = generateProof(m, tree);
      const encodedProof = encodeProof(proof, extendedMembers[i].nonce);
      return {
        member: extendedMembers[i].member,
        proof: encodedProof
      };
    } catch (e) {
      throw new Error(`Cannot generate proof for message ${i}, ${m} `);
    }
  });
  return { root, nonce: rootNonce, membership };
};

export const deriveMembershipProof = (
  proof: FullDisclosureProof,
  members: Buffer[]
): SelectiveDisclosureProof => {
  return {
    root: proof.root,
    membership: proof.membership.filter(em => {
      return members.includes(em.member);
    })
  };
};

export const verifyMembershipProof = (
  member: Buffer,
  proof: Buffer,
  root: Buffer,
  hash: Function = sha256
) => {
  const { nonce, auditPath } = decodeProof(proof);
  const saltedMember = hash(Buffer.concat([member, nonce]));
  const valid = validateProof(saltedMember, auditPath, root, hash);
  return valid;
};

export const compressDisclosureProof = (
  proof: FullDisclosureProof | SelectiveDisclosureProof
): BinaryDisclosureProof => {
  const pacted = Buffer.concat(
    proof.membership.map(m => {
      const proofLength = varint.encode(m.proof.length);
      return Buffer.concat([Buffer.from(proofLength), m.proof]);
    })
  );

  const components = [];

  if ((proof as FullDisclosureProof).nonce) {
    const nonce = Buffer.concat([
      Buffer.from(varint.encode((proof as FullDisclosureProof).nonce.length)),
      (proof as FullDisclosureProof).nonce
    ]);
    components.push(nonce);
  }

  const root = Buffer.concat([
    Buffer.from(varint.encode(proof.root.length)),
    proof.root
  ]);
  components.push(root);

  const compressedProofs = Buffer.concat([
    Buffer.from(varint.encode(pacted.length)),
    pacted
  ]);
  components.push(compressedProofs);

  // eventually these compressed proofs will get backed next to a signature.
  // full disclosure: signature + [nonce + root + compressed_proofs]
  // selective disclosure: signature + [root + compressed_proofs]
  // this library does not handle signatures.

  return Buffer.from(pako.deflate(Buffer.concat(components)));
};

export const expandDisclosureProof = (compressed: BinaryDisclosureProof) => {
  let pacted = Buffer.from(pako.inflate(compressed));
  let unpacted = unpact(pacted);
  let proof: any = {};

  if (unpacted.length === 3) {
    proof.nonce = unpacted[0];
    proof.root = unpacted[1];
  } else {
    proof.root = unpacted[0];
  }
  proof.membership = unpact(unpacted[unpacted.length - 1]).map((p: any) => {
    return { proof: p };
  });
  return proof;
};
