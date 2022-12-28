import { AutographNode, AutographEdge } from "./types";

import { transmute } from "./transmute";

const linkStyle = (e: AutographEdge) => {
  return `\t\t${e.source} ${e.label ? `-- ${e.label} -->` : `-.->`} ${
    e.target
  }\n`;
};

const nodeStyle = (n: AutographNode) => {
  return `\t\t${n.id}${`("${n.label}")`} \n`;
};

const mermaidAutographConfig: any = {
  header: true,
  markdown: false,
  style: "transmute",
  linkStyle: linkStyle,
  nodeStyle: nodeStyle
};

export const defaults = {
  transmute,
  linkStyle,
  nodeStyle,
  mermaidAutographConfig
};
