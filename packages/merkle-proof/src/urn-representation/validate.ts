import JsonMerkleTree from "../json-representation"

import { urnToObject } from './urnToObject'
import { MerkleTreeObject } from "../json-representation/types"

export const validate = (urn: string)=>{
  const obj = urnToObject(urn)
  const v = JsonMerkleTree.validate(obj as MerkleTreeObject)
  return v
 
}