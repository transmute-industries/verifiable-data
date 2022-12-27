
import BinaryMerkleTree from "../binary-merkle-tree"
import JsonMerkleTree from "../json-representation"

export const basicTree = (members: Buffer[], seed?:Buffer) => {
  let opts = undefined
  if (seed){
    const salts = BinaryMerkleTree.getSaltsForMembers(members, seed)
    opts =  { salts }
  }
  const tree = JsonMerkleTree.from(members, opts)
  let urn = `urn:merkle:${tree.root}?`
  urn += tree.members.map((m,i)=>{
    let member = tree.salts ? `${m}.${tree.salts[i]}`: `${m}` 
    return `${member}=${tree.paths[i]}`
  }).join('&')
  return urn
}