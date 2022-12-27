

import { MerkleTreeObject } from "../json-representation/types"


export const objectToUrn = (obj: MerkleTreeObject)=>{
  let urn = `urn:merkle:${obj.root}?`
  urn += obj.members.map((m,i)=>{
    let member = obj.salts ? `${m}.${obj.salts[i]}`: `${m}` 
    return `${member}=${obj.paths[i]}`
  }).join('&')
  return urn
}