import crypto from "crypto";
import base64url from "base64url";
import { sha256 } from "./sha256";
import { concatValues } from './concatValues'
import { getSaltedMember, addSaltsToMembers } from "./SaltedMembers";
import { review, urnToMermaid } from './autograph'
import { objectToAutograph } from './objectToAutograph'
import { objectToBinaryMerkelTree } from './binaryMerkleTreeAutograph'
import { addMerkleTreeAutographToMerkleProofAutograph } from './addMerkleTreeAutographToMerkleProofAutograph'

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

const generateSalt = () => {
  return crypto.randomBytes(32);
  // return base64url.toBuffer('PKRiX-VimjDbIs_Cpu-fM50J7i3ClvEfvgATpx2TjBA')
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

const merkleAuditPathToUrn = (auditPath: MerkleAuditPath): string => {
  return auditPath
    .map(component => {
      const direction = Object.keys(component)[0] === "left" ? "L" : "R";
      return `${direction}.${base64url.encode(
        Object.values(component)[0] as any
      )}`;
    })
    .join("~");
};

type MerkleTreeObject = {
  root: string;
  members: string[];
  salts: string[];
  proofs: string[];
};
const listToMerkleTreeObject = (list: Buffer[]): MerkleTreeObject => {
  const salts = list.map(generateSalt);
  const encodedMembers = list.map(m => base64url.encode(m));
  const encodedSalts = salts.map(s => base64url.encode(s));
  const saltedMembers = addSaltsToMembers(list, salts);
  const tree = computeTree(saltedMembers);
  const merkleAuditPaths = saltedMembers.map(sm =>
    createMerkleAuditPath(sm, tree)
  );
  const root = tree[0][0];
  const encodedRoot = base64url.encode(root);
  const proofUrns = merkleAuditPaths.map(auditPath => {
    return merkleAuditPathToUrn(auditPath);
  });
  return {
    root: encodedRoot,
    members: encodedMembers,
    salts: encodedSalts,
    proofs: proofUrns
  };
};

const merkleTreeObjectToUrn = (obj: MerkleTreeObject): string => {
  return `urn:tmt:${obj.root}?${obj.members
    .map((m, i) => {
      return `${m}.${obj.salts[i]}=${obj.proofs[i]}`;
    })
    .join("&")}`;
};

const filterByIndex = (list: string[], index: number[]) => {
  return list.filter((_v, i) => {
    return index.includes(i);
  });
};

const derive = (urn: string, index: number[]) => {
  const obj = urnToMerkleTreeObject(urn);
  const derivedDisclosedObject = {
    root: obj.root,
    members: filterByIndex(obj.members, index),
    salts: filterByIndex(obj.salts, index),
    proofs: filterByIndex(obj.proofs, index)
  };
  return merkleTreeObjectToUrn(derivedDisclosedObject);
};

const urnToMerkleTreeObject = (urn: string) => {
  const [_0, _1, data] = urn.split(":");
  if (_0 !== "urn" || _1 !== "tmt") {
    throw new Error("Unsupported URN");
  }
  const [root, encodedAuditPaths] = data.split("?");
  const members: string[] = [];
  const salts: string[] = [];
  const proofs: string[] = [];
  encodedAuditPaths.split("&").forEach(auditPaths => {
    const [saltedMember, encodedAuditPath] = auditPaths.split("=");
    const [member, salt] = saltedMember.split(".");
    members.push(member);
    salts.push(salt);
    proofs.push(encodedAuditPath);
  });
  return {
    root,
    members,
    salts,
    proofs
  };
};

const verify = (urn: string, member?: Buffer): boolean => {
  const obj = urnToMerkleTreeObject(urn);
  let includesMember = false;
  const validatedAuditPaths = obj.proofs.map((encodedAuditPath, i) => {
    const auditPath = encodedAuditPath.split("~").map(apc => {
      const [d, v] = apc.split(".");
      return {
        [d === "L" ? "left" : "right"]: base64url.toBuffer(v)
      };
    });
    const computedMember = concatValues([
      base64url.toBuffer(obj.members[i]),
      base64url.toBuffer(obj.salts[i])
    ]);
    if (member && member.equals(computedMember)) {
      includesMember = true;
    }
    return validateMerkleAuditPath(
      computedMember,
      auditPath,
      base64url.toBuffer(obj.root)
    );
  });
  const allPathsAreValid = validatedAuditPaths.every(v => v === true);
  const memberIsIncluded = member === undefined ? true : includesMember;
  return memberIsIncluded && allPathsAreValid;
};




const api = {
  create: listToMerkleTreeObject,
  urn: merkleTreeObjectToUrn,
  obj: urnToMerkleTreeObject,
  verify,
  derive,
  member: getSaltedMember,
  mermaid: urnToMermaid, // fix me
  review: review, // fix me
  objectToAutograph,
  objectToBinaryMerkelTree,
  addMerkleTreeAutographToMerkleProofAutograph
};

export default api