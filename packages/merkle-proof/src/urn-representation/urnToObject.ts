
import base64url from "base64url"
import { MerkleTreeObject } from "../json-representation/types"
import BinaryMerkleTree from "../binary-merkle-tree"

export const urnToObject = (urn: string): MerkleTreeObject => {
  const [isUrn, isUrnType, encodedMerkleStructure] = urn.split(':')
  if (isUrn !== 'urn'){
    throw new Error('Invalid URN.')
  }
  if (isUrnType !== 'merkle'){
    throw new Error('Invalid URN Type.')
  }
  const [root, encodedAuditPaths] = encodedMerkleStructure.split('?')
  let obj: any = {root, paths: [], leaves: [], members: [], salts: []};
  encodedAuditPaths.split('&').forEach((mp) => {
    const [sm, p] = mp.split('=');
    const [m, s] = sm.split('.');
    obj.paths.push(p)
    // code smell.
    let leaf = base64url.toBuffer(m)
    if (s){
      leaf = BinaryMerkleTree.concatValues([leaf, base64url.toBuffer(s)]) 
    }
    obj.leaves.push(base64url.encode(BinaryMerkleTree.sha256(leaf)))
    obj.members.push(m)
    if(s){
      obj.salts.push(s)
    }
  })
  if (obj.salts?.length === 0){
    delete obj.salts
  }
  return obj;
}