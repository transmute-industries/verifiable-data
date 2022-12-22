

import { SaltedMerkleTree } from './types'


const filterByIndex = (list: string[], index: number[]) => {
  return list.filter((_v, i) => {
    return index.includes(i);
  });
};

export const reveal = (tree: SaltedMerkleTree, indexes: number[]) =>{
  const copy = JSON.parse(JSON.stringify(tree));
  copy.paths = filterByIndex(copy.paths, indexes);
  copy.leaves = filterByIndex(copy.leaves, indexes);
  if (copy.members){
    copy.members = filterByIndex(copy.members, indexes);
  }
  if (copy.salts){
    copy.salts = filterByIndex(copy.salts, indexes);
  }
  return copy
}