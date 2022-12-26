import { MerkleAuditPath, Sibling, SiblingPosition } from "./types";

import { sha256 } from "./sha256";

const branchingFactor = 2;

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

export const createMerkleAuditPath = (
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
