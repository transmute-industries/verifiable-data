import {generateSalt} from './generateSalt'

export const getSaltsForMembers = (members: Buffer[], seed: Buffer)=>{
  const salts = members.map((_m, i) => {
    return generateSalt({ seed, index: i });
  });
  return salts
}
  