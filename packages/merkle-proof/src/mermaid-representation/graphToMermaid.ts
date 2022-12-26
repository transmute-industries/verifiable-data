import { AutographNode, AutographEdge, Autograph,  AutographOptions  } from './types'

import { wrapForMarkdown } from './wrapForMarkdown'

import { transmute } from './transmute';

const addNode = (autograph: Autograph, node: AutographNode, index: number, options: AutographOptions) => {
  let shape = `("${node.label || node.id}")`;
  let style = `\t\t${node.id}${shape} \n`;
  if (options.style !== 'none') {
    style += `\t\t${transmuteNodeStyle(autograph, node, options)} \n`;
  }
  console.log('unused index', index)
  return style
};

const addEdge = (link: AutographEdge, index: number, options: AutographOptions) => {
  const target = `${link.target}`;
  // refactor to use options for edge style
  console.log('unused options', options)
  const linkStyle = link.label
    ? `-- ${link.label} -->`
    : `-.->`;
  let style = `\t\t${link.source} ${linkStyle} ${target} \n`;
  if (options.style !== 'none') {
    style += `\t\t${transmuteLinkStyle(link, index)} \n`;
  }
  return style
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
  // refactor to use options for node style
  console.log('unused options', options)
  if (isRoot(autograph, node)) {
    return `style ${node.id} color:${transmute.primary.grey}, fill:${transmute.primary.purple.light}, stroke:${transmute.primary.purple.dark}, stroke-width: 2.0px`;
  } else if (isLeaf(autograph, node) && node.label) {
    return `style ${node.id} color:${transmute.primary.grey}, fill:${transmute.primary.purple.light}, stroke:${transmute.primary.purple.dark}, stroke-width: 2.0px`;
  } else if (isNodeInLabeledPath(autograph, node)) {
    return `style ${node.id} color:${transmute.secondary.light}, stroke:${transmute.secondary.light}, stroke-width: 1.0px`;
  } else {
    return `style ${node.id} stroke:${transmute.secondary.medium}, stroke-width: 1.0px`;
  }
};


export const graphToMermaid = (
  autograph: Autograph,
  options: AutographOptions = {}
) => {
  let final = "";
  autograph.nodes.forEach((node: AutographNode, index: number) => {
    final += addNode(autograph, node, index, options);
  });
  autograph.links.forEach((link: AutographEdge, index: number) => {
    final += addEdge(link, index, options);
  });
  final = final.substring(0, final.length - 1);
  const content =  `${options.header ? `
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
graph LR`: ``}
\tsubgraph ${autograph.title || "&nbsp;"}
\t\tdirection LR
${final}
\tend
`;

return options.markdown ? wrapForMarkdown(content) : content
};

