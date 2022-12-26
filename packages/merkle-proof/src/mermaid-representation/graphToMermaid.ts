import { AutographNode, AutographEdge, Autograph,  AutographOptions  } from './types'

import { wrapForMarkdown } from './wrapForMarkdown'

import { transmute } from './transmute';

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


export const graphToMermaid = (
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
  const content =  `
${options.header ? `%%{
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
  }`: ``}
  subgraph ${autograph.title || "&nbsp;"}
    direction LR
${final}
  end
`;

return options.markdown ? wrapForMarkdown(content) : content
};

