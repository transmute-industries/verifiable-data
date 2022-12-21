import base64url from "base64url";

import {getEncodedLeaf} from './getEncodedLeaf'

import BMT from './BMT'

type AutographNode = {
  id: string;
  label?: string;
  type?: string
};

type AutographEdge = {
  source: string;
  target: string;
  label?: string;
};

type Autograph = {
  title?: string;
  nodes: AutographNode[];
  links: AutographEdge[];
};


type MerkleTreeObject = {
  root: string;
  members: string[];
  salts: string[];
  proofs: string[];
};

const makeAutographMermaidSafe = (autograph: any) => {
  autograph.nodes = autograph.nodes.map((n: any) => {
    return { ...n, id: `${base64url.toBuffer(n.id).toString("hex")}` };
  });
  autograph.links = autograph.links.map((l: any) => {
    return {
      ...l,
      source: `${base64url.toBuffer(l.source).toString("hex")}`,
      target: `${base64url.toBuffer(l.target).toString("hex")}`
    };
  });
  return autograph;
};

const binaryMerkleTreeAutograph = (tree: Array<Buffer[]>): Autograph =>{
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  tree.forEach((level, leveIndex) => {
    level.forEach((node, nodeIndex) => {
      const id = base64url.encode(node);
      let nodeType ='node';
      if (leveIndex === 0){
        nodeType = 'root'
      }
      if (leveIndex === tree.length-1){
        nodeType = 'leaf'
      }
      nodes.push({ id, label: id, type: nodeType });
      const target = Math.floor(nodeIndex / 2);
      if (leveIndex > 0) {
        links.push({
          source: base64url.encode(tree[leveIndex][nodeIndex]),
          target: base64url.encode(tree[leveIndex - 1][target])
        });
      }
    });
  });
  const graph = { nodes, links };
  return makeAutographMermaidSafe(graph)
}

export const objectToBinaryMerkelTree = (obj: MerkleTreeObject)=>{
  const leafs = obj.members.map((m, i)=>{
    return getEncodedLeaf(m, obj.salts[i])
  }).map(base64url.toBuffer)
  const tree = BMT.computeTree(leafs)
  return binaryMerkleTreeAutograph(tree)
}


