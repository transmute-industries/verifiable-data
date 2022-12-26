import base64url from "base64url";

import { SaltedMerkleTree } from "../json-representation/types";

import BinaryMerkleTree from "../binary-merkle-tree";
import { Autograph } from "./types";

export const fullTreeObjectToFullTreeGraph = (
  fullTreeObject: SaltedMerkleTree
): Autograph => {
  const members = fullTreeObject.members.map((_m, i) => {
    if (fullTreeObject.salts) {
      return BinaryMerkleTree.concatValues([
        base64url.toBuffer(fullTreeObject.members[i]),
        base64url.toBuffer(fullTreeObject.salts[i])
      ]);
    } else {
      return base64url.toBuffer(fullTreeObject.members[i]);
    }
  });

  const tree = BinaryMerkleTree.computeTree(members);
  const fullTreeGraph = BinaryMerkleTree.encodeTreeAsGraph(tree);
  return fullTreeGraph;
};
