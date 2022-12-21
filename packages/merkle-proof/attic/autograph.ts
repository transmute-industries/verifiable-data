
import base64url from "base64url";


import { sha256 } from "./sha256";
import { concatValues } from './concatValues'

type AutographNode = {
  id: string;
  label?: string;
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

type AutographOptions = {
  style?: "subtle";
};

const transmute = {
  primary: {
    purple: { dark: "#27225b", light: "#594aa8" },
    red: "#ff605d",
    orange: "#fcb373",
    grey: "#f5f7fd",
    white: "#fff"
  },
  secondary: {
    teal: "#48caca",
    aqua: "#2cb3d9",
    dark: "#2a2d4c",
    medium: "#565a7c",
    light: "#8286a3"
  }
};

const addNode = (node: AutographNode) => {
  let shape = `("${node.label || node.id}")`;
  return `\t\t${node.id}${shape} \n`;
};

const addEdge = (link: AutographEdge, options: AutographOptions) => {
  const target = `${link.target}`;
  const linkStyle = link.label
    ? `-- ${link.label} -->`
    : options.style === "subtle"
    ? `-->`
    : `-.->`;
  return `\t\t${link.source} ${linkStyle} ${target} \n`;
};

const isRoot = (autograph: Autograph, node: AutographNode) => {
  return (
    0 ===
    autograph.links.filter((link: AutographEdge) => {
      return link.source === node.id;
    }).length
  );
};

const isLeaf = (autograph: Autograph, node: AutographNode) => {
  return (
    0 ===
    autograph.links.filter((link: AutographEdge) => {
      return link.target === node.id;
    }).length
  );
};

const isNodeInLabeledPath = (autograph: Autograph, node: AutographNode) => {
  let flag = false;
  autograph.links.forEach((link: AutographEdge) => {
    if (link.label && (link.source === node.id || link.target === node.id)) {
      flag = true;
    }
  });
  return flag;
};

const transmuteLinkStyle = (link: AutographEdge, index: number): string => {
  if (["left", "right"].includes(link.label || "none")) {
    return `linkStyle ${index} color:${transmute.primary.red}, stroke-width: 2.0px`;
  } else if (link.label) {
    return `linkStyle ${index} color:${transmute.primary.orange}, stroke-width: 2.0px`;
  }
  return `linkStyle ${index} color:${transmute.secondary.medium}, stroke:${transmute.secondary.medium}, stroke-width: 1.0px`;
};

const transmuteNodeStyle = (
  autograph: Autograph,
  node: AutographNode,
  options: AutographOptions
) => {
  if (options.style !== "subtle") {
    if (isRoot(autograph, node)) {
      return `style ${node.id} color:${transmute.primary.grey}, fill:${transmute.primary.purple.light}, stroke:${transmute.primary.purple.dark}, stroke-width: 2.0px`;
    } else if (isLeaf(autograph, node) && node.label) {
      return `style ${node.id} color:${transmute.primary.grey}, fill:${transmute.primary.purple.light}, stroke:${transmute.primary.purple.dark}, stroke-width: 2.0px`;
    } else if (isNodeInLabeledPath(autograph, node)) {
      return `style ${node.id} color:${transmute.secondary.light}, stroke:${transmute.secondary.light}, stroke-width: 1.0px`;
    }
  }
  return `style ${node.id} stroke:${transmute.secondary.medium}, stroke-width: 1.0px`;
};

export const autographToMermaid = (
  autograph: Autograph,
  options: AutographOptions = {}
) => {
  let final = "";
  let style = "";
  autograph.nodes.forEach((node: AutographNode) => {
    final += addNode(node);
    style += `\t\t${transmuteNodeStyle(autograph, node, options)} \n`;
  });
  autograph.links.forEach((link: AutographEdge, index: number) => {
    final += addEdge(link, options);
    style += `\t\t${transmuteLinkStyle(link, index)} \n`;
  });
  final += style;
  final = final.substring(0, final.length - 1);
  return `
\`\`\`mermaid
%%{
  init: {
    'flowchart': { 'curve': 'monotoneX' },
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '${transmute.secondary.dark}',
      'primaryTextColor': '${transmute.secondary.medium}',
      'nodeBorder': '${transmute.secondary.medium}',
      'edgeLabelBackground': '${transmute.secondary.dark}',
      'clusterBkg': '${transmute.secondary.dark}',
      'clusterBorder': '${transmute.secondary.dark}',
      'lineColor': '${transmute.secondary.medium}',
      'fontFamily': 'monospace',
      'darkmode': true
    }
  }
}%%
graph LR
linkStyle default fill:none, stroke-width: 1px, stroke: ${
    transmute.secondary.medium
  }
  subgraph ${autograph.title || "&nbsp;"}
    direction LR
${final}
  end
\`\`\`
`;
};

export const addProofToTree = (treeGraph: Autograph, proofGraph: Autograph) => {
  proofGraph.nodes.forEach(node => {
    const isNodeInTree =
      treeGraph.nodes.find(n => n.id === node.id) !== undefined;
    if (!isNodeInTree) {
      treeGraph.nodes.push(node);
    }
  });
  proofGraph.links.forEach(link => {
    treeGraph.links.push(link);
  });
  return treeGraph;
};


// TODO: refactor to be function of 
const urnToAutograph = (obj: any): Autograph => {
  if (obj.members.length === 1) {
    const auditPath = obj.proofs[0].split("~").map((apc:any) => {
      const [d, v] = apc.split(".");
      return {
        [d === "L" ? "left" : "right"]: base64url.toBuffer(v)
      };
    });
    return merkleProofToAutograph(
      base64url.toBuffer(obj.root),
      auditPath,
      base64url.toBuffer(obj.members[0]),
      base64url.toBuffer(obj.salts[0])
    );
  }
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  console.log('refactor to be function of ', obj)
  // const saltedMembers = addSaltsToMembers(
  //   obj.members.map(base64url.toBuffer),
  //   obj.salts.map(base64url.toBuffer)
  // );
  // const tree = computeTree(saltedMembers);
  // tree.forEach((level, leveIndex) => {
  //   level.forEach((node, nodeIndex) => {
  //     const id = base64url.encode(node);
  //     nodes.push({ id, label: id });
  //     const target = Math.floor(nodeIndex / 2);
  //     if (leveIndex > 0) {
  //       links.push({
  //         source: base64url.encode(tree[leveIndex][nodeIndex]),
  //         target: base64url.encode(tree[leveIndex - 1][target])
  //       });
  //     }
  //   });
  // });
  const graph = { nodes, links };
  return makeAutographMermaidSafe(graph);
};

const makeAutographMermaidSafe = (autograph: any) => {
  autograph.nodes = autograph.nodes.map((n: any) => {
    return { ...n, id: `${sha256(Buffer.from(n.id)).toString("hex")}` };
  });
  autograph.links = autograph.links.map((l: any) => {
    return {
      ...l,
      source: `${sha256(Buffer.from(l.source)).toString("hex")}`,
      target: `${sha256(Buffer.from(l.target)).toString("hex")}`
    };
  });
  return autograph;
};

// TODO Refact to be function of object instead.
const merkleProofToAutograph = (
  root: Buffer,
  proof: any[],
  member: Buffer,
  salt: Buffer
) => {
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  nodes.push({ id: base64url.encode(root), label: base64url.encode(root) });
  nodes.push({ id: base64url.encode(member), label: base64url.encode(member) });
  nodes.push({ id: base64url.encode(salt), label: base64url.encode(salt) });
  const saltedMember = concatValues([member, salt]);
  nodes.push({
    id: base64url.encode(sha256(saltedMember)),
    label: base64url.encode(sha256(saltedMember))
  });
  links.push({
    source: base64url.encode(member),
    label: "member",
    target: base64url.encode(sha256(saltedMember))
  });
  links.push({
    source: base64url.encode(salt),
    label: "salt",
    target: base64url.encode(sha256(saltedMember))
  });
  proof.forEach(s => {
    const keys = Object.keys(s);
    const [label] = keys;
    const values = Object.values(s);
    const id = base64url.encode(values[0] as any);
    const proofNode = { id, label: id };
    nodes.push(proofNode);
    const proofEdge = {
      source: nodes[nodes.length - 2].id,
      label,
      target: id
    };
    links.push(proofEdge);
  });
  links.push({
    source: links[links.length - 1].target,
    label: "proof",
    target: base64url.encode(root)
  });
  const graph = { nodes, links };
  return makeAutographMermaidSafe(graph);
};

const viewTreeWithProof = (treeUrn: string, proofUrn: string) => {
  return addProofToTree(urnToAutograph(treeUrn), urnToAutograph(proofUrn));
};

export const urnToMermaid = (urn: string) => {
  const autograph = urnToAutograph(urn);
  return autographToMermaid(autograph);
};

export const review = (treeUrn: string, proofUrn: string) => {
  const autograph = viewTreeWithProof(treeUrn, proofUrn);
  return autographToMermaid(autograph);
};