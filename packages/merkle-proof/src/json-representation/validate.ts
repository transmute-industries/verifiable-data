
import { SaltedMerkleTree } from './types'

import base64url from "base64url";
import { concatValues } from '../binary-merkle-tree/concatValues'

import BinaryMerkleTree from '../binary-merkle-tree'

const decodeAuditPath = (encodedAuditPath: string) =>{
  return encodedAuditPath.split('~').map((c)=>{
    const [d, v] = c.split('.')
    const direction = d === 'L' ? 'left' :'right'; 
    return { [direction]: base64url.toBuffer(v) }
  })
}

export const validate = (proof: SaltedMerkleTree): boolean => {
  if (proof.members){
    const saltedMembers = proof.members.map((m,i)=>{
      return concatValues([base64url.toBuffer(m), base64url.toBuffer(proof.salts[i])])
    })
    const computedLeaves = saltedMembers.map((m)=>{
      return base64url.encode(m)
    })
    const allProofsAreValid = proof.paths.map(decodeAuditPath).map((p, i)=>{
      return BinaryMerkleTree.validateMerkleAuditPath(saltedMembers[i], p, base64url.toBuffer(proof.root) )
    }).every((p)=> p === true)
    const leavesAreValid = JSON.stringify(proof.leaves) === JSON.stringify(computedLeaves)
    return allProofsAreValid && leavesAreValid;
  } else {
    const allProofsAreValid = proof.paths.map(decodeAuditPath).map((p, i)=>{
      return BinaryMerkleTree.validateMerkleAuditPath(base64url.toBuffer(proof.leaves[i]), p, base64url.toBuffer(proof.root) )
    }).every((p)=> p === true)
    return allProofsAreValid
  }
 
}