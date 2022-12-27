import { MerkleTreeObject } from "./types";

import base64url from "base64url";
import { concatValues } from "../binary-merkle-tree/concatValues";

import BinaryMerkleTree from "../binary-merkle-tree";

const decodeAuditPath = (encodedAuditPath: string) => {
  return encodedAuditPath.split("~").map(c => {
    const [d, v] = c.split(".");
    const direction = d === "L" ? "left" : "right";
    return { [direction]: base64url.toBuffer(v) };
  });
};

// code smell
export const validate = (proof: MerkleTreeObject): boolean => {
  if (proof.salts) {
    const saltedMembers = proof.members.map((m, i) => {
      return concatValues([
        base64url.toBuffer(m),
        base64url.toBuffer((proof as any).salts[i] )
      ]);
    });
    const computedLeaves = saltedMembers.map(m => {
      return base64url.encode(BinaryMerkleTree.sha256(m));
    });
    const allProofsAreValid = proof.paths
      .map(decodeAuditPath)
      .map((p, i) => {
        return BinaryMerkleTree.validateMerkleAuditPath(
          BinaryMerkleTree.sha256(saltedMembers[i]),
          p,
          base64url.toBuffer(proof.root)
        );
      })
      .every(p => p === true);
    const leavesAreValid =
      JSON.stringify(proof.leaves) === JSON.stringify(computedLeaves);
    return allProofsAreValid && leavesAreValid;
  } else {
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
  }
};
