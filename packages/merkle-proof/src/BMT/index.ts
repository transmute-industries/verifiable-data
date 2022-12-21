
import { sha256 } from "../sha256";
import { concatValues } from '../concatValues'

const branchingFactor = 2;

enum SiblingPosition {
  left = "left",
  right = "right"
}

type Sibling = {
  [SiblingPosition.left]?: Buffer;
  [SiblingPosition.right]?: Buffer;
};

type MerkleAuditPath = Array<Sibling>;

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

const computeTree = (values: Buffer[], hash = sha256): Array<Buffer[]> => {
  const hashedValues = values.map(hash);
  const tree = [hashedValues];
  while (tree[0].length !== 1) {
    const nextLevel = computeNextLevel(tree[0], hash);
    tree.unshift(nextLevel);
  }
  return tree;
};

const setNextTargetIndexByBranchingFactor = (targetIndexInLevel: number) => {
  return Math.floor(targetIndexInLevel / branchingFactor);
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
  auditPath: MerkleAuditPath
) => {
  const isRightNode = targetIndexInLevel % branchingFactor;
  const siblingIndex = isRightNode
    ? targetIndexInLevel - 1
    : targetIndexInLevel + 1;
  const siblingValue = tree[level][siblingIndex];
  const sibling: Sibling = isRightNode
    ? { [SiblingPosition.left]: siblingValue }
    : { [SiblingPosition.right]: siblingValue };
  auditPath.push(sibling);
};

const createMerkleAuditPath = (
  targetValue: Buffer,
  tree: Array<Buffer[]>,
  hash: Function = sha256
): MerkleAuditPath => {
  const targetHash = hash(targetValue);
  let targetIndexInLevel = tree[tree.length - 1].findIndex(v => {
    return v.equals(targetHash);
  });
  if (targetIndexInLevel < 0) {
    return [];
  }
  const auditPath: MerkleAuditPath = [];
  for (let level = tree.length - 1; level > 0; level--) {
    if (levelHasSiblingProof(targetIndexInLevel, level, tree)) {
      addSiblingProof(tree, level, targetIndexInLevel, auditPath);
    }
    targetIndexInLevel = setNextTargetIndexByBranchingFactor(
      targetIndexInLevel
    );
  }
  return auditPath;
};

export const validateMerkleAuditPath = (
  targetValue: Buffer,
  auditPath: MerkleAuditPath,
  root: Buffer,
  hash: Function = sha256
): boolean => {
  const targetHash = hash(targetValue);
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


const api = {
  computeTree,
  createMerkleAuditPath,
  validateMerkleAuditPath
};

export default api