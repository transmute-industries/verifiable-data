import { SaltedMerkleTree } from '../json-representation/types'

type AutographNode = {
  id: string;
  label?: string;
  type?: string;
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

type AutographOptions = {
  hypergraph: boolean
}


const graphHasEdge = (g: Autograph, e:AutographEdge) =>{
  return g.links.find((link: AutographEdge)=>{
    return link.source === e.source && link.target === e.target;
  }) !== undefined
}

const graphHasNode = (g: Autograph, n:AutographNode) =>{
  return g.nodes.find((node: AutographNode)=>{
    return node.id === n.id;
  }) !== undefined
}

const addEdge = (g: Autograph, e:AutographEdge, options: AutographOptions) => {
  if (options.hypergraph){
    g.links.push(e)
  } else {
    if (!graphHasEdge(g, e)){
      g.links.push(e)
    }
  }
}

const addNode = (g: Autograph, n:AutographNode) =>{
  return g.nodes.push(n);
}

export const merkleTreeObjectToGraph = (obj: SaltedMerkleTree, options: AutographOptions = { hypergraph: true }): Autograph => {
  const nodes: AutographNode[] = [];
  const links: AutographEdge[] = [];
  const graph = {nodes, links};

  nodes.push({
    id: 'root',
    label: obj.root
  })
  obj.leaves.forEach((_m, i)=>{
    nodes.push({
      id: `leaf-${i}`,
      label: obj.leaves[i]
    })
    if (obj.salts){
      nodes.push({
        id: `member-${i}`,
        label: obj.members[i]
      })
      nodes.push({
        id: `salt-${i}`,
        label: obj.salts[i]
      })
      addEdge(graph, {
        source: `member-${i}`,
        label: 'member',
        target: `leaf-${i}`,
      }, options)
      addEdge(graph, {
        source: `salt-${i}`,
        label: 'salt',
        target: `leaf-${i}`,
      }, options)
    }
    const paths = obj.paths[i].split('~');

    paths.forEach((p) => {
      const [d, id] = p.split('.')
      const pathNodeId = `node-${id}`
      const node = {
        id: pathNodeId,
        label: id,
      }
      const edge = {
        source: pathNodeId,
        label: d === 'L' ? 'left' : 'right',
        target: pathNodeId,
      }
      if (!graphHasNode(graph, node)){
        addNode(graph, node)
      }
      if (!graphHasEdge(graph, edge)){
        addEdge(graph, edge, options)
      }
      
      // const lastNodeIndex = obj.salts ? 2 : 2;
      // const previousNode = nodes[nodes.length - lastNodeIndex]
      
      
      // if (j === paths.length -1){
      //   const edge = {
      //     source: graph.links[links.length-1].target,
      //     label: 'proof',
      //     target: 'root',
      //   }
    
      //   if (!graphHasEdge(graph, edge)){
      //     addEdge(graph,edge , options)
      //   }
      // }
    })
    
    
  })
 
  return graph
}