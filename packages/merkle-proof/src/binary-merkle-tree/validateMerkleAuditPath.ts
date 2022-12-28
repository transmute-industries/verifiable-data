import { MerkleAuditPath } from "./types";
import { sha256 } from "./sha256";
import { concatValues } from "./concatValues";

import { HashFunction } from './types';

export const validateMerkleAuditPath = (
  targetHash: Buffer,
  auditPath: MerkleAuditPath,
  root: Buffer,
  hash: HashFunction = sha256
): boolean => {
  if (auditPath.length === 0) {
    return targetHash.equals(root);
  }
  let proofHash = targetHash;
  for (const p of auditPath) {
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
