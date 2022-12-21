

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



export const addMerkleTreeAutographToMerkleProofAutograph = (tree: Autograph, proof: Autograph): Autograph =>{
  const combined = JSON.parse(JSON.stringify(tree)) as Autograph;
  proof.nodes.forEach(node => {
    const isNodeInTree =
    combined.nodes.find(n => n.label === node.label) !== undefined;
    if (!isNodeInTree) {
      combined.nodes.push(node);
    }
  });
  proof.links.forEach(link => {
    combined.links.push(link);
  });
  return combined;
}