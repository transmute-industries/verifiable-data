import base64url from 'base64url';

import { SaltedMerkleTree } from '../json-representation/types'

import BinaryMerkleTree from '../binary-merkle-tree';
import { Autograph } from './types';


export const fullTreeObjectToFullTreeGraph = (fullTreeObject: SaltedMerkleTree): Autograph => {
  const saltedMembers  = fullTreeObject.members.map((_m, i)=>{
    return BinaryMerkleTree.concatValues([
      base64url.toBuffer(fullTreeObject.members[i]), 
      base64url.toBuffer(fullTreeObject.salts[i]), 
    ]);
  })

  const tree = BinaryMerkleTree.computeTree(saltedMembers);
  const fullTreeGraph = BinaryMerkleTree.encodeTreeAsGraph(tree)
  return fullTreeGraph
}