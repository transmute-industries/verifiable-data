
import base64url from "base64url";
import BinaryMerkleTree from "../binary-merkle-tree";
import { concatValues } from '../binary-merkle-tree/concatValues'
import { MerkleAuditPath } from '../binary-merkle-tree/types'
import { MerkleTreeObject, MerkleTreeBranch, SaltedMerkleTree, MerkleTreeOptions } from './types'

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

export const from = (members: Buffer[], options: MerkleTreeOptions = { salts: undefined }): SaltedMerkleTree => {
  let saltedMembers = members;
  // technically not a leaf... get rid of this.
  saltedMembers = members.map((m, i)=>{
    if (options.salts){
      return concatValues([m, options.salts[i]]);
    } else {
     return m
    }
  })
  
  const tree = BinaryMerkleTree.computeTree(saltedMembers)
  const auditPaths = saltedMembers.map(sm =>
    BinaryMerkleTree.createMerkleAuditPath(sm, tree)
  );
  const root = tree[0][0];
  const encodedRoot = base64url.encode(root);
  const encodedAuditPaths = auditPaths.map(encodeAuditPath).map(encodedAuditPathToProof);
  const encodedLeaves = saltedMembers.map((sm)=>{
    return base64url.encode( BinaryMerkleTree.sha256(sm) )
  })
  const obj: MerkleTreeObject = {
    root: encodedRoot,
    leaves: encodedLeaves,
    paths: encodedAuditPaths,
  };

  (obj as SaltedMerkleTree).members = members.map((m)=>{
    return base64url.encode(m)
  });
  if (options.salts){
    (obj as SaltedMerkleTree).salts = options.salts.map((m)=>{
      return base64url.encode(m)
    });
  }
  return orderMerkleTreeObject(obj)
}