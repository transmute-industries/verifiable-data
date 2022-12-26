
import { AutographNode, AutographEdge, AutographOptions } from "./types";

import { transmute } from "./transmute";


const transmuteLinkStyle = (link: AutographEdge, index: number): string => {
  if (["left", "right"].includes(link.label || "none")) {
    return `linkStyle ${index} color:${transmute.primary.red}, stroke-width: 2.0px`;
  } else if (link.label) {
    return `linkStyle ${index} color:${transmute.primary.orange}, stroke-width: 2.0px`;
  }
  return `linkStyle ${index} color:${transmute.secondary.medium}, stroke:${transmute.secondary.medium}, stroke-width: 1.0px`;
};

const linkStyle = (e: AutographEdge, i: number, options: AutographOptions) => {
  const edgeStyle =  e.label ? `-- ${e.label} -->`: `-.->`;
  let linkComponent = `\t\t${e.source} ${edgeStyle} ${e.target} \n`;
  if (options.style !== 'none') {
    linkComponent += `\t\t${transmuteLinkStyle(e, i)} \n`;
  }
  return linkComponent
}

const transmuteNodeStyle = (
  node: AutographNode,
  options: AutographOptions
) => {
  // refactor to use options for node style
  console.log('unused options', options)
  if (node.isRoot) {
    return `style ${node.id} color:${transmute.primary.grey}, fill:${transmute.primary.purple.light}, stroke:${transmute.primary.purple.dark}, stroke-width: 2.0px`;
  } else if (node.isLeaf && node.label) {
    return `style ${node.id} color:${transmute.primary.grey}, fill:${transmute.primary.purple.light}, stroke:${transmute.primary.purple.dark}, stroke-width: 2.0px`;
  }  else {
    return `style ${node.id} stroke:${transmute.secondary.medium}, stroke-width: 1.0px`;
  }

  // probably no needed, if the default style is muted...
  // if (isNodeInLabeledPath(autograph, node)) {
  //   return `style ${node.id} color:${transmute.secondary.light}, stroke:${transmute.secondary.light}, stroke-width: 1.0px`;
  // }
  // const isNodeInLabeledPath = (autograph: Autograph, node: AutographNode) => {
  //   let flag = false;
  //   autograph.links.forEach((link: AutographEdge) => {
  //     if (link.label && (link.source === node.id || link.target === node.id)) {
  //       flag = true;
  //     }
  //   });
  //   return flag;
  // };
  
};

const nodeStyle = (n: AutographNode, i: number, options: AutographOptions) => {
  const nodeShape = `("${n.label || i}")`;
  let nodeComponent = `\t\t${n.id}${nodeShape} \n`;
  if (options.style !== 'none') {
    nodeComponent += `\t\t${transmuteNodeStyle(n, options)} \n`;
  }
  return nodeComponent
}


export const defaults = {linkStyle, nodeStyle}

