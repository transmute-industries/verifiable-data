import { AutographNode, AutographEdge, AutographOptions } from "./types";

import { transmute } from "./transmute";

const linkStyle = (
  e: AutographEdge,
  _i: number,
  _options: AutographOptions
) => {
  return `\t\t${e.source} ${e.label ? `-- ${e.label} -->` : `-.->`} ${
    e.target
  }\n`;
};

const nodeStyle = (
  n: AutographNode,
  _i: number,
  _options: AutographOptions
) => {
  return `\t\t${n.id}${`("${n.label}")`} \n`;
};

export const defaults = { transmute, linkStyle, nodeStyle };

// LINK STYLES MUST BE APPLIED AT THE END...
// import { transmute } from "./transmute";
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

// let linkComponent = `\t\t${e.source} ${edgeStyle} ${e.target} \n`;
// linkComponent += `\t\t${transmuteLinkStyle(e, i)} \n`;
// return linkComponent

// const transmuteLinkStyle = (link: AutographEdge, index: number): string => {
//   console.log(link)
//   if (["left", "right"].includes(link.label || "none")) {
//     return `linkStyle ${index} color:${transmute.primary.red}, stroke-width: 2.0px`;
//   } else if (link.label) {
//     return `linkStyle ${index} color:${transmute.primary.orange}, stroke-width: 2.0px`;
//   }
//   return `linkStyle ${index} color:${transmute.secondary.medium}, stroke:${transmute.secondary.medium}, stroke-width: 1.0px`;
// };
