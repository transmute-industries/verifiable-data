import { AutographNode, AutographEdge, Autograph  } from './types'

import {makeMermaidSafe} from './makeMermaidSafe'
export const encodedAuditPathToSubgraph = (leaf: string, encodedAuditPath: string, root: string) =>{
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  let graph: Autograph = { nodes, links}
  nodes.push({
    id: leaf,
    label: leaf,
    isLeaf: true
  })
  encodedAuditPath.split('~').forEach((component: string)=>{
    const [d, v] = component.split('.');
    const direction = d === 'L' ? 'left': 'right';
    nodes.push({ id : v, label: v })
    links.push({
      source: nodes[nodes.length -2].id,
      label: direction,
      target: v
    })
  })
  nodes.push({
    id: root,
    label: root
  })
  links.push({
    source: nodes[nodes.length -2].id,
    label: 'proof',
    target: root
  })
  makeMermaidSafe(graph);
  return graph
}