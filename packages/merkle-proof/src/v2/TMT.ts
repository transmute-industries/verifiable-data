
import crypto from "crypto";
import base64url from "base64url";

const branchingFactor = 2;
enum SiblingPosition {
  left = "left",
  right = "right"
}

type Sibling = {
  [SiblingPosition.left]?: Buffer;
  [SiblingPosition.right]?: Buffer;
};

type MerkleAuditPath = Array<Sibling>;

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

const autographToMermaid = (
  autograph: Autograph,
  options: AutographOptions = {}
) => {
  let final = "";
  let style = ""
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

const sha256 = (data: Buffer) => {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest();
};

const concatValues = (values: Buffer[]): Buffer => {
  return values.slice(1).reduce((pv: any, cv: any) => {
    return Buffer.concat([pv, cv]);
  }, values[0]);
};

const computeNextLevel = (values: Buffer[], hash: Function) => {
  const nextLevel: Buffer[] = [];
  const clones = values.map(x => x);
  while (clones.length >= branchingFactor) {
    const group = clones.splice(0, branchingFactor);
    const groupHash = hash(concatValues(group));
    nextLevel.push(groupHash);
  }
  clones.forEach(c => {
    nextLevel.push(c);
  });
  return nextLevel;
};

const computeTree = (
  values: Buffer[],
  hash = sha256
): Array<Buffer[]> => {
  const hashedValues = values.map(hash);
  const tree = [hashedValues];
  while (tree[0].length !== 1) {
    const nextLevel = computeNextLevel(tree[0], hash);
    tree.unshift(nextLevel);
  }
  return tree;
};

const generateSalt = () =>{
  return crypto.randomBytes(32)
}


export const addSaltsToMembers = (members: Buffer[], salts: Buffer[]) =>{
  return members.map((member, i)=>{
    return concatValues([member, salts[i]])
  })
}

const setNextTargetIndexByBranchingFactor = (targetIndexInLevel: number) => {
  return Math.floor(targetIndexInLevel / branchingFactor);
};

const levelHasSiblingProof = (
  targetIndexInLevel: number,
  level: number,
  tree: Array<Buffer[]>
) => {
  return !(
    targetIndexInLevel === tree[level].length - 1 &&
    tree[level].length % branchingFactor === 1
  );
};

const addSiblingProof = (
  tree: Array<Buffer[]>,
  level: number,
  targetIndexInLevel: number,
  auditPath: MerkleAuditPath
) => {
  const isRightNode = targetIndexInLevel % branchingFactor;
  const siblingIndex = isRightNode
    ? targetIndexInLevel - 1
    : targetIndexInLevel + 1;
  const siblingValue = tree[level][siblingIndex];
  const sibling: Sibling = isRightNode
    ? { [SiblingPosition.left]: siblingValue }
    : { [SiblingPosition.right]: siblingValue };
  auditPath.push(sibling);
};


const createMerkleAuditPath = (
  targetValue: Buffer,
  tree: Array<Buffer[]>,
  hash: Function = sha256
): MerkleAuditPath => {
  const targetHash = hash(targetValue);
  let targetIndexInLevel = tree[tree.length - 1].findIndex(v => {
    return v.equals(targetHash);
  });
  if (targetIndexInLevel < 0) {
    return [];
  }
  const auditPath: MerkleAuditPath = [];
  for (let level = tree.length - 1; level > 0; level--) {
    if (levelHasSiblingProof(targetIndexInLevel, level, tree)) {
      addSiblingProof(tree, level, targetIndexInLevel, auditPath);
    }
    targetIndexInLevel = setNextTargetIndexByBranchingFactor(
      targetIndexInLevel
    );
  }
  return auditPath;
};

export const validateMerkleAuditPath = (
  targetValue: Buffer,
  auditPath: MerkleAuditPath,
  root: Buffer,
  hash: Function = sha256
): boolean => {
  const targetHash = hash(targetValue);
  if (auditPath.length === 0) {
    return targetHash.equals(root);
  }
  let proofHash = targetHash;
  for (const p of auditPath) {
    if (!p.left && !p.right) {
      return false;
    }
    if (p.left) {
      proofHash = hash(concatValues([p.left, proofHash]));
    }
    if (p.right) {
      proofHash = hash(concatValues([proofHash, p.right]));
    }
  }
  return proofHash.equals(root);
};

type MerkleAuditPathComponent = `${'L'|'R'}.${string}`

const merkleAuditPathToUrn = (auditPath: MerkleAuditPath): string=> {
  return auditPath.map((component)=>{
    const direction = Object.keys(component)[0] === 'left' ? 'L': 'R'
    return `${direction}.${base64url.encode(Object.values(component)[0])}` as MerkleAuditPathComponent
  }).join('~')
}

type MerkleTreeObject = {
  root: string,
  members: string[],
  salts: string[],
  proofs: string[],

}
const listToMerkleTreeObject = (list: Buffer[]): MerkleTreeObject=>{
  const salts = list.map(generateSalt)
  const encodedMembers = list.map((m)=> base64url.encode(m))
  const encodedSalts = salts.map((s)=> base64url.encode(s))
  const saltedMembers = addSaltsToMembers(list, salts)
  const tree = computeTree(saltedMembers)
  const merkleAuditPaths = saltedMembers.map((sm)=> createMerkleAuditPath(sm, tree))
  const root = tree[0][0]
  const encodedRoot = base64url.encode(root)
  const proofUrns = merkleAuditPaths.map((auditPath)=> {
    return merkleAuditPathToUrn(auditPath)
  })
  return { 
    root: encodedRoot,
    members: encodedMembers, 
    salts: encodedSalts,
    proofs: proofUrns
  }
}

const merkleTreeObjectToUrn = (obj: MerkleTreeObject): string => {
  return `urn:tmt:${obj.root}?${obj.members.map((m,i)=>{
    return `${m}.${obj.salts[i]}=${obj.proofs[i]}`
  }).join('&')}`
}

const filterByIndex = (list: string[], index: number[])=>{
  return list.filter((_v, i)=>{
    return index.includes(i)
  })
}

const addProofToTree = (treeGraph: Autograph, proofGraph: Autograph) => {
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

const viewTreeWithProof = (treeUrn: string, proofUrn: string)=> {
  return addProofToTree(urnToAutograph(treeUrn), urnToAutograph(proofUrn))
}

const derive = (urn: string, index: number[])=> {
  const obj = urnToMerkleTreeObject(urn)
  const derivedDisclosedObject = {
    root: obj.root,
    members: filterByIndex(obj.members, index),
    salts: filterByIndex(obj.salts, index),
    proofs: filterByIndex(obj.proofs, index),
  }
  return merkleTreeObjectToUrn(derivedDisclosedObject)
}

const urnToMerkleTreeObject = (urn: string)=>{
  const [_0, _1, data] = urn.split(':')
  const [root, encodedAuditPaths] = data.split('?')
  const members: string[] = [];
  const salts: string[] = [];
  const proofs: string[] = [];
  encodedAuditPaths.split('&').forEach((auditPaths)=>{
    const [saltedMember, encodedAuditPath] = auditPaths.split('=')
    const [member, salt] = saltedMember.split('.')
    members.push(member);
    salts.push(salt)
    proofs.push(encodedAuditPath)
  })
  return { 
    root,
    members, 
    salts,
    proofs
  }
}

const verify = (urn: string, member?: Buffer): boolean => {
  const obj = urnToMerkleTreeObject(urn);
  let includesMember = false;
  const validatedAuditPaths = obj.proofs.map((encodedAuditPath, i)=>{
    const auditPath = encodedAuditPath.split('~').map((apc)=>{
      const [d, v] = apc.split('.');
      return {
        [d === 'L'? 'left' : 'right' ]: base64url.toBuffer(v) 
      }
    })
    const computedMember = concatValues([ base64url.toBuffer(obj.members[i]), base64url.toBuffer(obj.salts[i]) ])
    if (member && member.equals(computedMember)){
      includesMember = true;
    }
    return validateMerkleAuditPath(
      computedMember,
      auditPath,
      base64url.toBuffer(obj.root)
    )
  })
  const allPathsAreValid = validatedAuditPaths.every((v)=> v === true)
  const memberIsIncluded = member === undefined ? true: includesMember
  return memberIsIncluded && allPathsAreValid;
}

const urnToAutograph = (urn: string): Autograph => {
  const obj = urnToMerkleTreeObject(urn);
  if (obj.members.length === 1){
    const auditPath = obj.proofs[0].split('~').map((apc)=>{
      const [d, v] = apc.split('.');
      return {
        [d === 'L'? 'left' : 'right' ]: base64url.toBuffer(v) 
      }
    })
    return merkleProofToAutograph(base64url.toBuffer(obj.root), auditPath, base64url.toBuffer(obj.members[0]), base64url.toBuffer(obj.salts[0]) )
  }
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  const saltedMembers = addSaltsToMembers(obj.members.map(base64url.toBuffer), obj.salts.map(base64url.toBuffer))
  const tree = computeTree(saltedMembers)
  tree.forEach((level, leveIndex) => {
    level.forEach((node, nodeIndex) => {
      const id = base64url.encode(node);
      nodes.push({ id, label: id });
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
  return makeAutographMermaidSafe(graph);
};


const makeAutographMermaidSafe = (autograph:any)=>{
  autograph.nodes = autograph.nodes.map((n:any)=>{
    return {...n, id: `${sha256(Buffer.from(n.id)).toString('hex')}`}
  })
  autograph.links = autograph.links.map((l:any)=>{
    return {...l, source: `${sha256(Buffer.from(l.source)).toString('hex')}`, target: `${sha256(Buffer.from(l.target)).toString('hex')}`}
  })
  return autograph
}
const merkleProofToAutograph = (
  root: Buffer,
  proof: Sibling[],
  member: Buffer,
  salt: Buffer
) => {
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  nodes.push({ id: base64url.encode(root), label: base64url.encode(root) });
  nodes.push({ id: base64url.encode(member), label: base64url.encode(member) });
  nodes.push({ id: base64url.encode(salt), label: base64url.encode(salt) });
  const saltedMember = concatValues([member, salt])
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
    const id = base64url.encode(values[0]);
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

const urnToMermaid = (urn: string)=>{
  const autograph = urnToAutograph(urn);
  return autographToMermaid(autograph)
}

const getSaltedMember = (member: string, salt: string): Buffer => {
  return addSaltsToMembers([base64url.toBuffer(member)], [base64url.toBuffer(salt)])[0];
}

const review = (treeUrn: string, proofUrn: string)=>{
  const autograph = viewTreeWithProof(treeUrn, proofUrn);
  return autographToMermaid(autograph)
}

export const TMT = {  
  create: listToMerkleTreeObject, 
  urn: merkleTreeObjectToUrn, 
  obj: urnToMerkleTreeObject, 
  verify, 
  derive, 
  member: getSaltedMember, 

  mermaid: urnToMermaid, 
  
  review 
}

