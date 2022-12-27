import { computeTree } from "./computeTree";
import { createMerkleAuditPath } from "./createMerkleAuditPath";
import { validateMerkleAuditPath } from "./validateMerkleAuditPath";
import { encodeTreeAsGraph } from "./encodeTreeAsGraph";
import { generateSalt } from "./generateSalt";
import { concatValues } from "./concatValues";
import { sha256 } from "./sha256";
import { getSaltsForMembers } from './getSaltsForMembers'

const BinaryMerkleTree = {
  computeTree,
  createMerkleAuditPath,
  validateMerkleAuditPath,
  encodeTreeAsGraph,
  generateSalt,
  getSaltsForMembers,
  concatValues,
  sha256
};

export default BinaryMerkleTree;
