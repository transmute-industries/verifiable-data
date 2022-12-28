import { MerkleTreeObject } from "../json-representation/types";
import { graphToMermaid } from "./graphToMermaid";
import { fullTreeObjectToFullTreeGraph } from "./fullTreeObjectToFullTreeGraph";
import { defaults } from "./defaults";
import { wrapForMarkdown } from "./wrapForMarkdown";
import { inclusionLeafGraph } from "./inclusionLeafGraph";

import { Autograph, AutographEdge } from "./types";
import BinaryMerkleTree from "../binary-merkle-tree";

const {
  transmute: { primary, secondary }
} = defaults;

let defaultNodeStyle = `color:${secondary.medium}, stroke:${secondary.medium}, stroke-width: 1.0px`;
let defaultLinkStyle = `color:${secondary.medium}, stroke:${secondary.medium}, stroke-width: 1.0px`;

let rootNodeStyle = `color:${primary.white}, fill: ${primary.purple.light}, stroke:${primary.purple.dark}, stroke-width: 2.0px`;
let leafNodeStyle = `color:${primary.white}, fill: ${primary.purple.light}, stroke:${primary.purple.dark}, stroke-width: 2.0px`;

let memberNodeStyle = `color:${primary.red}, stroke:${primary.red}, stroke-width: 2.0px`;
let saltNodeStyle = `color:${primary.orange}, stroke:${primary.orange}, stroke-width: 2.0px`;

let memberLinkStyle = `color:${primary.red}, stroke:${secondary.light}, stroke-width: 2.0px`;
let saltLinkStyle = `color:${primary.orange}, stroke:${secondary.light}, stroke-width: 2.0px`;
let proofLinkStyle = `color:${primary.orange}, stroke:${secondary.light}, stroke-width: 2.0px`;
let pathNodeStyle = `color:${secondary.light}, stroke:${secondary.light}, stroke-width: 2.0px`;

const walkToRoot = (g: Autograph, e: AutographEdge) => {
  let nextEdge = e;
  if (nextEdge) {
    if (e.label === "proof") {
      e.linkStyle = proofLinkStyle;
    } else {
      e.linkStyle = memberLinkStyle;
    }
    const node = g.nodes.find(n => {
      return n.id === e.source;
    });
    if (node) {
      node.nodeStyle = pathNodeStyle;
    }
    const nextEdge = g.links.find(le => {
      return le.source === e.target;
    });
    if (nextEdge) {
      walkToRoot(g, nextEdge);
    }
  }
};

const addStylesToGraphs = (graphs: Autograph[]) => {
  let linkCounter = -1;
  graphs.forEach(g => {
    const leafEdge = g.links.find(le => {
      return le.fromLeaf && g.title === "Merkle Tree";
    });
    if (leafEdge) {
      walkToRoot(g, leafEdge);
    }
    g.links = g.links.map(e => {
      linkCounter++;
      let linkStyle = defaultLinkStyle;
      if (e.label === "member") {
        linkStyle = memberLinkStyle;
      }
      if (e.label === "salt") {
        linkStyle = saltLinkStyle;
      }
      if (e.linkStyle) {
        linkStyle = e.linkStyle;
      }
      return { ...e, linkStyle: `linkStyle ${linkCounter} ${linkStyle} ` };
    });
    g.nodes = g.nodes.map(n => {
      let nodeStyle = defaultNodeStyle;
      if (n.isRoot) {
        nodeStyle = rootNodeStyle;
      }
      if (n.isLeaf) {
        nodeStyle = leafNodeStyle;
      }
      if (n.isMember) {
        nodeStyle = memberNodeStyle;
      }
      if (n.isSalt) {
        nodeStyle = saltNodeStyle;
      }
      if (n.nodeStyle) {
        nodeStyle = n.nodeStyle;
      }
      return { ...n, nodeStyle: `style ${n.id} ${nodeStyle}` };
    });
  });
};

const computeGraphStyle = (g: Autograph) => {
  let style = `%% ${g.title}\n`;
  g.nodes.forEach(n => {
    style += `${n.nodeStyle}\n`;
  });
  g.links.forEach(e => {
    style += `${e.linkStyle}\n`;
  });
  return style;
};

export const inclusionProof = (
  fullTreeObject: MerkleTreeObject,
  targetMember: Buffer,
  targetSalt?: Buffer
) => {
  const leafGraph = inclusionLeafGraph({
    targetMember,
    targetSalt,
    hash: BinaryMerkleTree.sha256
  });
  const autographOptions = {
    markdown: false,
    style: "transmute",
    linkStyle: defaults.linkStyle,
    nodeStyle: defaults.nodeStyle
  };
  const fullTreeGraph = fullTreeObjectToFullTreeGraph(fullTreeObject);
  fullTreeGraph.nodes = fullTreeGraph.nodes.map(n => {
    if (!leafGraph.nodes.find(ln => ln.id === n.id)) {
      delete n.isLeaf;
    }
    return n;
  });
  fullTreeGraph.links = fullTreeGraph.links.map(e => {
    if (!leafGraph.links.find(ln => ln.target === e.source)) {
      delete e.fromLeaf;
    }
    return e;
  });
  const graphs = [fullTreeGraph, leafGraph];
  addStylesToGraphs(graphs);
  const diagrams = graphs
    .map((g, i) => {
      return graphToMermaid(g, { header: i === 0, ...autographOptions } as any);
    })
    .join("");
  const styles = graphs
    .map(g => {
      return computeGraphStyle(g);
    })
    .join("");
  const final = diagrams + "\n" + styles;
  return wrapForMarkdown(final);
};
