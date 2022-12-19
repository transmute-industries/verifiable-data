import crypto from "crypto";
import base64url from "base64url";

/* eslint-disable @typescript-eslint/no-unused-vars */

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

const setNextTargetIndexByBranchingFactor = (targetIndexInLevel: number) => {
  return Math.floor(targetIndexInLevel / branchingFactor);
};

const addSiblingProof = (
  tree: Array<Buffer[]>,
  level: number,
  targetIndexInLevel: number,
  proof: Sibling[]
) => {
  const isRightNode = targetIndexInLevel % branchingFactor;
  const siblingIndex = isRightNode
    ? targetIndexInLevel - 1
    : targetIndexInLevel + 1;
  const siblingValue = tree[level][siblingIndex];
  const sibling: Sibling = isRightNode
    ? { [SiblingPosition.left]: siblingValue }
    : { [SiblingPosition.right]: siblingValue };
  proof.push(sibling);
};

export const generateProof = (
  targetValue: Buffer,
  tree: Array<Buffer[]>,
  hash: Function = sha256
): Sibling[] => {
  const targetHash = hash(targetValue);
  let targetIndexInLevel = tree[tree.length - 1].findIndex(v => {
    return v.equals(targetHash);
  });
  if (targetIndexInLevel < 0) {
    return [];
  }

  const proof: Sibling[] = [];
  for (let level = tree.length - 1; level > 0; level--) {
    if (levelHasSiblingProof(targetIndexInLevel, level, tree)) {
      addSiblingProof(tree, level, targetIndexInLevel, proof);
    }
    targetIndexInLevel = setNextTargetIndexByBranchingFactor(
      targetIndexInLevel
    );
  }
  return proof;
};

export const validateProof = (
  targetValue: Buffer,
  proof: MerkleAuditPath,
  root: Buffer,
  hash: Function = sha256
): boolean => {
  const targetHash = hash(targetValue);
  if (proof.length === 0) {
    return targetHash.equals(root);
  }
  let proofHash = targetHash;
  for (const p of proof) {
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

export const computeTree = (
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

export const encodeTreeAsUrn = (tree: Array<Buffer[]>) => {
  let urn = `urn:merkle-tree:base64url:sha256:`;
  tree.forEach(level => {
    level.forEach(node => {
      urn += base64url.encode(node) + ":";
    });
  });
  urn = urn.substring(0, urn.length - 1);
  return urn;
};

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
  nodes: AutographNode[];
  links: AutographEdge[];
};

const addEdge = (
  tree: Array<Buffer[]>,
  level: number,
  source: number,
  links: any
) => {
  const target = Math.floor(source / 2);
  // console.log( {level, source, target} )
  if (level > 0) {
    links.push({
      source: base64url.encode(tree[level][source]),
      target: base64url.encode(tree[level - 1][target])
    });
  }
};
export const encodeTreeAsObject = (tree: Array<Buffer[]>) => {
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  tree.forEach((level, leveIndex) => {
    level.forEach((node, nodeIndex) => {
      const id = base64url.encode(node);
      nodes.push({ id });
      addEdge(tree, leveIndex, nodeIndex, links);
    });
  });

  const graph = { nodes, links };
  return graph;
};

export const encodeProofAsObject = (
  root: Buffer,
  proof: Sibling[],
  member: Buffer
) => {
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];

  nodes.push({ id: base64url.encode(root), label: base64url.encode(root) });
  nodes.push({ id: base64url.encode(member), label: base64url.encode(member) });
  links.push({
    source: base64url.encode(member),
    label: "hash",
    target: base64url.encode(sha256(member))
  });
  nodes.push({
    id: base64url.encode(sha256(member)),
    label: base64url.encode(sha256(member))
  });
  proof.forEach(s => {
    const keys = Object.keys(s);
    const [label] = keys;
    const values = Object.values(s);
    const id = base64url.encode(values[0]);
    const proofNode = { id };
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
  return graph;
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

export const encodeProofAsUrn = (
  root: Buffer,
  proof: Sibling[],
  member: Buffer
): string => {
  let urn = `urn:merkle-proof:base64url:sha256:${base64url.encode(root)}`;
  // urn += '\n';
  proof.reverse().forEach(s => {
    const keys = Object.keys(s);
    const [label] = keys;
    const values = Object.values(s);
    const id = base64url.encode(values[0]);
    urn += `~${label}~${id}`;
  });
  // urn += '\n';
  urn += `#${base64url.encode(member)}`;
  return urn;
};

export const validateProofUrn = (proofUrn: string, targetValue: Buffer) => {
  const [urn, fragment] = proofUrn.split("#");
  if (!targetValue.equals(base64url.toBuffer(fragment))) {
    console.warn("Fragment does not match target value.");
  }
  const [_0, _1, _2, _3, encodedRoot]: any = urn.split(":");
  const root2 = base64url.toBuffer(encodedRoot.split("~")[0]);
  const [_4, ...auditPathEncoded] = urn.split("~");
  const auditPath = [];
  for (let i = 0; i <= auditPathEncoded.length - 2; i += 2) {
    const side = auditPathEncoded[i];
    const hash = auditPathEncoded[i + 1];
    auditPath.push({
      [side]: base64url.toBuffer(hash)
    });
  }
  const isProofValid = validateProof(targetValue, auditPath.reverse(), root2);
  return isProofValid;
};

export const proofUrnToJson = (proofUrn: string): string => {
  const [urn] = proofUrn.split("#");
  const [_0, type, encoding, hash, encodedRoot]: any = urn.split(":");
  const [root, ...path] = encodedRoot.split("~");
  const directions = path.filter((_v: any, i: number) => {
    return i % 2 === 0;
  });
  const nodes = path.filter((_v: any, i: number) => {
    return i % 2 !== 0;
  });

  return JSON.stringify(
    {
      type,
      encoding,
      hash,
      root,
      directions,
      nodes
    },
    null,
    2
  );
};

export const treeUrnToJson = (treeUrn: string): string => {
  const [urn] = treeUrn.split("#");
  const [_0, type, encoding, hash, ...levels]: any = urn.split(":");

  return JSON.stringify(
    {
      type,
      encoding,
      hash,
      levels
    },
    null,
    2
  );
};

const getTreeFromUrn = (urn: string) => {
  const [_0, _1, _2, _3, ...encodedNodes] = urn.split(":");
  const nodes = encodedNodes.map(base64url.toBuffer);
  let levels: any = [];
  let currentLevel = 0;
  for (const node of nodes) {
    levels[currentLevel] = levels[currentLevel] || [];
    levels[currentLevel].push(node);
    if (levels[currentLevel].length === 2 ** currentLevel) {
      currentLevel++;
    }
  }

  return levels;
};

const getProofFromUrn = (urn: string) => {
  const [first, member] = urn.split("#");
  const [_0, _1, _2, _3, ...encodedPath] = first.split(":");
  const parts = encodedPath[0].split("~");
  const auditPath = [];
  const root = base64url.toBuffer(parts[0]);
  for (let i = 1; i <= parts.length - 2; i += 2) {
    const side = parts[i];
    const hash = parts[i + 1];
    auditPath.push({
      [side]: base64url.toBuffer(hash)
    });
  }
  return {
    root,
    proof: auditPath.reverse(),
    member: base64url.toBuffer(member)
  };
};

const autograph = {
  raw: {
    tree: (members: Buffer[]) => {
      return encodeTreeAsObject(computeTree(members));
    },
    proof: (root: Buffer, proof: Sibling[], member: Buffer) => {
      return encodeProofAsObject(root, proof, member);
    }
  },
  urn: {
    tree: (urn: string) => {
      return encodeTreeAsObject(getTreeFromUrn(urn));
    },
    proof: (urn: string) => {
      const { root, proof, member } = getProofFromUrn(urn);
      return encodeProofAsObject(root, proof, member);
    }
  }
};

export const generateSalt = () =>{
  return crypto.randomBytes(32)
}

export const addSaltsToMembers = (members: Buffer[], salts: Buffer[]) =>{
  return members.map((member, i)=>{
    return concatValues([member, salts[i]])
  })
}

export const saltMember = (member:Buffer, salt:Buffer)=> concatValues([member, salt]);


const encodeDisclosureObject = (members: Buffer[])=>{
  const salts = members.map(generateSalt)
  const encodedMembers = members.map((m)=> base64url.encode(m))
  const encodedSalts = salts.map((s)=> base64url.encode(s))
  const saltedMembers = addSaltsToMembers(members, salts)
  // const encodedSaltedMembers = saltedMembers.map((s)=> base64url.encode(s))
  const tree = computeTree(saltedMembers)
  const proofs = saltedMembers.map((sm)=> generateProof(sm, tree))
  const root = tree[0][0]
  const encodedRoot = base64url.encode(root)
  const proofUrns = proofs.map((p, i)=> encodeProofAsUrn(root, p, saltedMembers[i])).map((urn)=>{
    return urn.split(encodedRoot).pop()?.split('#')[0]
  })
  return { 
    root: encodedRoot,
    members: encodedMembers, 
    salts: encodedSalts,
    // saltedMembers: encodedSaltedMembers,
    proofs: proofUrns
  }
}

const disclosureObjectToUrn = (obj: any)=> {
  let urn  = `urn:merkle-disclosure:${obj.root}`;
  let query:string[] = [];
  obj.members.forEach((member: string, i:number)=>{
    query.push(`${member}.${obj.salts[i]}=${obj.proofs[i]}`)
  })
  urn += `?${query.join('&')}`
  return urn
}

const disclosureUrnToDisclosureObject = (urn: string) =>{
  const [_0, _1, rest] = urn.split(':')
  const [root, rest2] = rest.split('?')
  const members: string[] = [];
  const salts: string[] = []
  const proofs: string[] = []
  rest2.split('&').forEach((p)=>{
    const [encodedSaltedMember, encodedAuditPath] = p.split('=')
    const [member, salt] = encodedSaltedMember.split('.')
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

const filterByIndex = (list: string[], index: number[])=>{
  return list.filter((_v, i)=>{
    return index.includes(i)
  })
}

const deriveDisclosedUrn = (urn: string, index: number[]) => {
  const disclosureObject = disclosureUrnToDisclosureObject(urn)
  const derivedDisclosedObject = {
    root: disclosureObject.root,
    members: filterByIndex(disclosureObject.members, index),
    salts: filterByIndex(disclosureObject.salts, index),
    proofs: filterByIndex(disclosureObject.proofs, index),
  }
  return disclosureObjectToUrn(derivedDisclosedObject)

}

const validateDisclosureUrn = (urn: string)=>{
  const obj = disclosureUrnToDisclosureObject(urn)
  console.log(obj)
  return false
}

const disclosure = {
  obj: {
    generate:  encodeDisclosureObject
  },
  urn: {
    generate: (members: Buffer[])=>{
      const obj = encodeDisclosureObject(members)
      return disclosureObjectToUrn(obj)
    },
    derive: deriveDisclosedUrn,
    verify: validateDisclosureUrn
  }
}

export class MerkleTree {
  private members: Buffer[];
  private tree: Array<Buffer[]>;
  private root: Buffer;
  public urn: string;
  static autograph = autograph;
  static disclosure = disclosure;

  static from(data: any) {
    if (Array.isArray(data)) {
      return new MerkleTree({ members: data });
    }
    throw new Error("Cannot create tree from " + data);
  }
  static validateProofUrn(proofUrn: string, member: Buffer) {
    return validateProofUrn(proofUrn, member);
  }

  constructor({ members }: { members: Buffer[] }) {
    this.members = members;
    this.tree = computeTree(this.members);
    this.root = this.tree[0][0];
    this.urn = encodeTreeAsUrn(this.tree);
  }

  getProofUrn(member: Buffer) {
    const p = generateProof(member, this.tree);
    return encodeProofAsUrn(this.root, p, member);
  }
}

/* eslint-enable @typescript-eslint/no-unused-vars */
