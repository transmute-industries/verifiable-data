import BinaryMerkleTree from "../binary-merkle-tree";
import JsonMerkleTree from "../json-representation";

import { objectToUrn } from "./objectToUrn";

export const from = (members: Buffer[], seed?: Buffer) => {
  let opts = undefined;
  if (seed) {
    const salts = BinaryMerkleTree.getSaltsForMembers(members, seed);
    opts = { salts };
  }
  const tree = JsonMerkleTree.from(members, opts);
  return objectToUrn(tree);
};
