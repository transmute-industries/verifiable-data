import { MerkleTreeObject } from "../json-representation/types";

export const objectToUrn = (obj: MerkleTreeObject) => {
  let urn = `urn:merkle:${obj.root}?`;
  urn += obj.leaves
    .map((leaf, i) => {
      let encodedLeaf = obj.salts ? `${leaf}.${obj.salts[i]}` : `${leaf}`;
      return `${encodedLeaf}=${obj.paths[i]}`;
    })
    .join("&");
  return urn;
};
