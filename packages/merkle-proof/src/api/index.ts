import base64url from "base64url";
import BinaryMerkleTree from "../binary-merkle-tree";
import JsonMerkleTree from "../json-representation";
import MerkleMermaid from "../mermaid-representation";
import MerkleUrn from "../urn-representation";

import { MerkleAuditPath } from "../binary-merkle-tree/types";
import { MerkleTreeObject } from "../json-representation/types";

const salt = {
  from: (members: Buffer[], seed: Buffer) => {
    return BinaryMerkleTree.getSaltsForMembers(members, seed);
  },
};


const tree = {
  from: (members: Buffer[]) => {
    return BinaryMerkleTree.computeTree(members);
  },
  proof: {
    create: (
      tree: Buffer[][],
      value: Buffer,
      hash = BinaryMerkleTree.sha256
    ) => {
      const targetHash = hash(value);
      const proof = BinaryMerkleTree.createMerkleAuditPath(value, tree, hash);
      const result = { targetHash, proof, root: tree[0][0] };
      if (proof.length === 0) {
        throw new Error(
          "Cannot produce proof, the value is not included in the tree."
        );
      }
      return result;
    },
    verify: (
      targetHash: Buffer,
      proof: MerkleAuditPath,
      root: Buffer,
      hash = BinaryMerkleTree.sha256
    ) => {
      return BinaryMerkleTree.validateMerkleAuditPath(
        targetHash,
        proof,
        root,
        hash
      );
    },
  },
};


type CreateMerkleObject = { members: Buffer[]; salts?: Buffer[] };
type RevealMerkleObject = {
  proof: MerkleTreeObject;
  reveal: number[];
};
type ValidateMerkleTreeObject = {
  proof: MerkleTreeObject;
};
type VerifyMerkleObject = {
  proof: MerkleTreeObject;
  value: Buffer;
  salt?: Buffer;
};

const object = {
  create: ({ members, salts }: CreateMerkleObject) => {
    return JsonMerkleTree.from(members, { salts });
  },
  reveal: ({ proof, reveal }: RevealMerkleObject) => {
    return JsonMerkleTree.reveal(proof, reveal);
  },
  validate: ({ proof }: ValidateMerkleTreeObject) => {
    return JsonMerkleTree.validate(proof);
  },
  verify: ({ proof, value, salt }: VerifyMerkleObject) => {
    const targetHash = base64url.encode(
      BinaryMerkleTree.getTargetHash({ value, salt })
    );
    const isTargetHashInProof = proof.leaves.includes(targetHash);
    return isTargetHashInProof && JsonMerkleTree.validate(proof);
  },
};


type ValidateMerkleUrn = {
  urn: string
}

type RevealMerkleUrn = {
  urn: string;
  reveal: number[]
}


type VerifyMerkleUrn = {
  urn: string;
  value: Buffer;
  salt?: Buffer
}

const urn = {
  create: ({ members, salts }: CreateMerkleObject) => {
    return MerkleUrn.from(members, salts);
  },
  reveal: ({ urn, reveal }: RevealMerkleUrn) => {
    return MerkleUrn.reveal(urn, reveal);
  },
  validate: ({ urn }: ValidateMerkleUrn) => {
    return MerkleUrn.validate(urn)
  },
  verify: ({ urn, value, salt }: VerifyMerkleUrn) => {
    const targetHash = base64url.encode(
      BinaryMerkleTree.getTargetHash({ value, salt })
    );
    const obj = MerkleUrn.toObject(urn);
    const isTargetHashInProof = obj.leaves.includes(targetHash);
    return isTargetHashInProof && MerkleUrn.validate(urn);
  },
};

const api = {
  tree,
  object,
  urn,
  salt,
  util: {
    BinaryMerkleTree,
    JsonMerkleTree,
    MerkleMermaid,
  },
};

export default api;
