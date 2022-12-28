import JsonMerkleTree from "../json-representation";

import { objectToUrn } from "./objectToUrn";

export const from = (members: Buffer[], salts?: Buffer[]) => {
  const tree = JsonMerkleTree.from(members, { salts });
  return objectToUrn(tree);
};
