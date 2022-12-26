
import base64url from "base64url";
import BinaryMerkleTree from "../binary-merkle-tree";
import { concatValues } from '../binary-merkle-tree/concatValues'
import { MerkleAuditPath } from '../binary-merkle-tree/types'
import { MerkleTreeObject, MerkleTreeBranch, SaltedMerkleTree, MerkleTreeOptions } from './types'

import { generateSalt } from '../binary-merkle-tree/generateSalt'

const encodeAuditPath = (auditPath: MerkleAuditPath): MerkleTreeBranch[]  => {
  return auditPath.map((component)=>{
    const [key] = Object.keys(component)
    const [value] = Object.values(component)
    return { [key]: base64url.encode(value)} as MerkleTreeBranch
  })
}

const orderMerkleTreeObject = (obj: any)=>{
  return JSON.parse(JSON.stringify({
    root: obj.root,
    paths: obj.paths,
    leaves: obj.leaves,
    members: obj.members,
    salts: obj.salts
  }));
}

const encodedAuditPathToProof = (auditPath: MerkleTreeBranch[]): string => {
  return auditPath.map((p) => {
    const d = Object.keys(p)[0] === 'left' ? 'L' : 'R';
    const v = Object.values(p)[0]
    return `${d}.${v}`
  }).join('~')
}

export const from = (members: Buffer[], options: MerkleTreeOptions = { salt: true}): SaltedMerkleTree => {
  let leaves = members;
  let salts: Buffer[] = [];
  if (options.salt){
    salts = members.map(()=>{
      return generateSalt()
    })
    leaves = members.map((m, i)=>{
      return concatValues([m, salts[i]]);
    })
  }
  const tree = BinaryMerkleTree.computeTree(leaves)
  const auditPaths = leaves.map(sm =>
    BinaryMerkleTree.createMerkleAuditPath(sm, tree)
  );
  const root = tree[0][0];
  const encodedRoot = base64url.encode(root);
  const encodedAuditPaths = auditPaths.map(encodeAuditPath).map(encodedAuditPathToProof);
  const encodedLeaves = leaves.map((leaf)=>{
    return base64url.encode(leaf)
  })
  const obj: MerkleTreeObject = {
    root: encodedRoot,
    leaves: encodedLeaves,
    paths: encodedAuditPaths,
  }
  if (options.salt){
    (obj as SaltedMerkleTree).members = members.map((m)=>{
      return base64url.encode(m)
    });
    (obj as SaltedMerkleTree).salts = salts.map((m)=>{
      return base64url.encode(m)
    });
  }
  return orderMerkleTreeObject(obj)
}