import {
  AutographNode,
  AutographEdge,
  Autograph,
  AutographOptions
} from "./types";

import { wrapForMarkdown } from "./wrapForMarkdown";

import { transmute } from "./transmute";
import { defaults } from "./defaults";

const { secondary } = transmute;

export const graphToMermaid = (
  autograph: Autograph,
  options: AutographOptions = {
    linkStyle: defaults.linkStyle,
    nodeStyle: defaults.nodeStyle
  }
) => {
  let final = "";
  autograph.nodes.forEach((node: AutographNode, index: number) => {
    final += options.nodeStyle(node, index, options);
  });
  autograph.links.forEach((link: AutographEdge, index: number) => {
    final += options.linkStyle(link, index, options);
  });
  final = final.substring(0, final.length - 1);
  let content = `${
    options.header
      ? `
%%{
  init: {
    'flowchart': { 'curve': 'monotoneX' },
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '${secondary.dark}',
      'primaryTextColor': '${secondary.medium}',
      'nodeBorder': '${secondary.medium}',
      'edgeLabelBackground': '${secondary.dark}',
      'clusterBkg': '${secondary.dark}',
      'clusterBorder': '${secondary.dark}',
      'lineColor': '${secondary.medium}',
      'fontFamily': 'monospace',
      'darkmode': true
    }
  }
}%%
%% Support https://transmute.industries
graph LR`
      : ``
  }
\tsubgraph ${autograph.title || "&nbsp;"}
\t\tdirection LR
${final}
\tend`;
  return options.markdown ? wrapForMarkdown(content) : content;
};
