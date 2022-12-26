

import { computeTree } from './computeTree'
import { createMerkleAuditPath } from './createMerkleAuditPath'
import { validateMerkleAuditPath } from './validateMerkleAuditPath'
import { encodeTreeAsGraph } from './encodeTreeAsGraph'
import { generateSalt } from './generateSalt'
import { concatValues } from './concatValues'

const BinaryMerkleTree = {
  computeTree,
  createMerkleAuditPath,
  validateMerkleAuditPath,
  encodeTreeAsGraph,
  generateSalt,
  concatValues

};

export default BinaryMerkleTree