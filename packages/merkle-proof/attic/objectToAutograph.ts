import base64url from 'base64url'
import {getEncodedLeaf} from './getEncodedLeaf'

type AutographNode = {
  id: string;
  label?: string;
  type?: string;
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

export const objectToAutograph = (obj: MerkleTreeObject): Autograph => {
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  nodes.push({
    id: obj.root,
    label: obj.root,
    type: 'root'
  })
  obj.members.forEach((_m, i)=>{
    nodes.push({
      id: obj.members[i],
      label: obj.members[i],
      type: 'member'
    })
    nodes.push({
      id: obj.salts[i],
      label: obj.salts[i],
      type: 'salt'
    })
    const leaf = getEncodedLeaf(obj.members[i] , obj.salts[i])
    nodes.push({
      id: leaf,
      label: leaf,
      type: 'leaf'
    })
    links.push({
      source: obj.members[i],
      label: 'member',
      target: leaf,
    })
    links.push({
      source: obj.salts[i],
      label: 'salt',
      target: leaf,
    })
    obj.proofs[i].split('~').forEach((p) => {
      const [d, node] = p.split('.')
      nodes.push({
        id: node,
        label: node,
        type: 'node'
      })
      links.push({
        source: nodes[nodes.length-2].id,
        label: d === 'L' ? 'left' : 'right',
        target: node,
      })
    })
    links.push({
      source: links[links.length-1].target,
      label: 'proof',
      target: obj.root,
    })
  })
  const graph = {nodes, links}
  return makeAutographMermaidSafe(graph)
}