
import { MerkleTreeObject } from "../json-representation/types"

export const urnToObject = (urn: string): MerkleTreeObject => {
  const [isUrn, isUrnType, encodedMerkleStructure] = urn.split(':')
  if (isUrn !== 'urn'){
    throw new Error('Invalid URN.')
  }
  if (isUrnType !== 'merkle'){
    throw new Error('Invalid URN Type.')
  }
  const [root, encodedAuditPaths] = encodedMerkleStructure.split('?')
  let obj: any = {root, paths: [], leaves: [], salts: []};
  encodedAuditPaths.split('&').forEach((mp) => {
    const [sm, p] = mp.split('=');
    const [leaf, salt] = sm.split('.');
    obj.paths.push(p)
    obj.leaves.push(leaf)
    if(salt){
      obj.salts.push(salt)
    }
  })
  if (obj.salts?.length === 0){
    delete obj.salts
  }
  return obj;
}