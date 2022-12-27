import { MerkleTreeObject } from "./types";

import base64url from "base64url";

import BinaryMerkleTree from "../binary-merkle-tree";

const decodeAuditPath = (encodedAuditPath: string) => {
  return encodedAuditPath.split("~").map(c => {
    const [d, v] = c.split(".");
    const direction = d === "L" ? "left" : "right";
    return { [direction]: base64url.toBuffer(v) };
  });
};

export const validate = (proof: MerkleTreeObject): boolean => {
  const allProofsAreValid = proof.paths
    .map(decodeAuditPath)
    .map((p, i) => {
      return BinaryMerkleTree.validateMerkleAuditPath(
        base64url.toBuffer(proof.leaves[i]),
        p,
        base64url.toBuffer(proof.root)
      );
    })
    .every(p => p === true);
  return allProofsAreValid;
};
