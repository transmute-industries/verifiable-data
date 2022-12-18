
type AutographNode = {
  id: string,
  label?: string
}

type AutographEdge = {
  source: string,
  target: string,
  label?: string
}

type Autograph = {
  title?: string,
  nodes: AutographNode[]
  links: AutographEdge[]
}

type AutographOptions = {
  style?: 'subtle'
}

const transmute = {
  primary: {
    purple: { dark: "#27225b", light: "#594aa8" },
    red: "#ff605d",
    orange: "#fcb373",
    grey: "#f5f7fd",
    white: "#fff",
  },
  secondary: {
    teal: "#48caca",
    aqua: "#2cb3d9",
    dark: "#2a2d4c",
    medium: "#565a7c",
    light: "#8286a3",
  },
};

const addNode = (node:AutographNode)=>{
  let shape = `(${node.label || node.id})`
  return `\t\t${node.id}${shape} \n`
}

const addEdge = (link:AutographEdge, options:AutographOptions)=>{
  const target = `${link.target}`
  const linkStyle = link.label ? `-- ${link.label} -->`: options.style === 'subtle' ?  `-->`: `-.->`
  return `\t\t${link.source} ${linkStyle} ${target} \n`
}

const isRoot = (autograph:Autograph, node:AutographNode)=>{
  return 0 == autograph.links.filter((link:AutographEdge)=>{
    return link.source === node.id
  }).length;
}

const isLeaf = (autograph:Autograph, node:AutographNode)=>{
  return 0 == autograph.links.filter((link:AutographEdge)=>{
    return link.target === node.id
  }).length;
}

const isNodeInLabeledPath = (autograph:Autograph, node:AutographNode)=>{
  let flag = false;
  autograph.links.forEach((link:AutographEdge)=>{
    if (link.label && (link.source === node.id || link.target === node.id)){
      flag = true;
    }
  })
  return flag;
}

const transmuteLinkStyle = (link:AutographEdge, index: number): string =>{
  if (['left', 'right'].includes(link.label || 'none') ){
    return `linkStyle ${index} color:${transmute.primary.red}, stroke-width: 2.0px` 
  } else if (link.label){
    return `linkStyle ${index} color:${transmute.primary.orange}, stroke-width: 2.0px`
  } 
  return `linkStyle ${index} color:${transmute.secondary.medium}, stroke:${transmute.secondary.medium}, stroke-width: 1.0px`
}

const transmuteNodeStyle = (autograph: Autograph, node:AutographNode, options:AutographOptions) => {
  if (options.style !== 'subtle'){
    if (isRoot(autograph, node)){
      return `style ${node.id} color:${transmute.primary.grey}, fill:${transmute.primary.purple.light}, stroke:${transmute.primary.purple.dark}, stroke-width: 2.0px`
    } else if (isLeaf(autograph, node) && node.label){
      return `style ${node.id} color:${transmute.primary.grey}, fill:${transmute.primary.purple.light}, stroke:${transmute.primary.purple.dark}, stroke-width: 2.0px`
    } else if (isNodeInLabeledPath(autograph, node)){
      return `style ${node.id} color:${transmute.secondary.light}, stroke:${transmute.secondary.light}, stroke-width: 1.0px`
    }
  }
  return `style ${node.id} stroke:${transmute.secondary.medium}, stroke-width: 1.0px`
}

const autographToMermaid = (autograph:Autograph, options:AutographOptions = {}) => {
  let final = ''
  autograph.nodes.forEach((node:AutographNode) => {
    final += addNode(node)
    final += `\t\t${transmuteNodeStyle(autograph, node, options)} \n`
  });
  autograph.links.forEach((link:AutographEdge, index: number) => {
    final += addEdge(link, options)
    final += `\t\t${transmuteLinkStyle(link, index)} \n`
  });
  final = final.substring(0, final.length-1)
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
graph
linkStyle default fill:none, stroke-width: 1px, stroke: ${transmute.secondary.medium}
  subgraph ${autograph.title || '&nbsp;'}
    direction LR
${final}
  end
\`\`\`
` 
};

export default autographToMermaid