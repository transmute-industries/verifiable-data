import { sha256 } from "./sha256";
import { concatValues } from "./concatValues";

const branchingFactor = 2;

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
