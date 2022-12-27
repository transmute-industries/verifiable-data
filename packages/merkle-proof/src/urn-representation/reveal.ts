

import { urnToObject } from "./urnToObject";

import JsonMerkleTree from '../json-representation';
import  { objectToUrn } from './objectToUrn'

export const reveal = (treeUrn: string, indexes: number[])=>{
  const treeObject = urnToObject(treeUrn);
  const filteredObject = JsonMerkleTree.reveal(treeObject as any, indexes);
  return objectToUrn(filteredObject)
}