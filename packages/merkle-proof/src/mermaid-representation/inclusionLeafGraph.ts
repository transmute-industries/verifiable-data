import base64url from "base64url";
import { Autograph } from "./types";
import BinaryMerkleTree from "../binary-merkle-tree";

import { makeMermaidSafe } from "./makeMermaidSafe";

type LeafGraphArgs = {
  hash: Function;
  targetMember: Buffer;
  targetSalt?: Buffer;
};

export const inclusionLeafGraph = (args: LeafGraphArgs) => {
  const { targetMember, targetSalt, hash } = args;
  const g: Autograph = { title: "Merkle Leaf", nodes: [], links: [] };
  const memberId = base64url.encode(targetMember).substring(0, 29) + "...";
  const memberNode = {
    id: memberId,
    label: memberId,
    isMember: true
  };
  g.nodes.push(memberNode);
  let targetValue = targetMember;
  let targetHash = hash(targetValue);
  let saltEdge = undefined;
  if (targetSalt) {
    const saltId = base64url.encode(targetSalt);
    const saltNode = {
      id: saltId,
      label: saltId,
      isSalt: true
    };
    g.nodes.push(saltNode);
    targetValue = BinaryMerkleTree.concatValues([targetMember, targetSalt]);
    targetHash = hash(targetValue);
    const leafId = base64url.encode(targetHash);
    saltEdge = {
      source: saltId,
      target: leafId,
      label: "salt"
    };
  }
  const leafId = base64url.encode(targetHash);
  const leafNode = {
    id: leafId,
    label: leafId,
    isLeaf: true
  };
  g.nodes.push(leafNode);
  const memberEdge = {
    source: memberId,
    target: leafId,
    label: "member"
  };
  g.links.push(memberEdge);
  if (saltEdge) {
    g.links.push(saltEdge);
  }
  makeMermaidSafe(g);
  return g;
};
