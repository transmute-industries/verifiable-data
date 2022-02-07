import Graph from 'graphology';

import getXmlFromJsonGraph from './getXmlFromJsonGraph';
export interface WorkflowDefintionOptions {
  id: string;
}

const colors = {
  orange: '#FF3D00',
  pink: '#D500F9',
  green: '#76FF03',
  blue: '#1E88E5',
  red: '#FF5252',
  gold: '#F9A825',
};

const edgeTypeToEdgeColor = (type: any) => {
  // data.nodes[0].color = colors.blue;
  // data.nodes[0].shape = "torus";
  // data.nodes[1].color = colors.green;
  // data.nodes[1].shape = "cube";
  // data.links[0].color = colors.orange;
  // data.links[1].color = colors.pink;
  switch (type) {
    default:
      return '#fff';
  }
};

const nodeTypeToNodeColor = (type: any) => {
  switch (type) {
    case 'Start':
      return colors.green;
    case 'Task':
      return colors.blue;
    case 'Switch':
      return colors.gold;
    case 'Stop':
      return colors.red;
    default:
      return '#fff';
  }
};

const nodeTypeToNodeShape = (type: any) => {
  switch (type) {
    case 'Start':
      return 'torus';
    case 'Task':
      return 'cube';
    case 'Switch':
      return 'dodecahedron';
    case 'Stop':
      return 'torus';
    default:
      return 'sphere';
  }
};

export class WorkflowDefinition {
  id: string;
  type: string = 'WorkflowDefinition';
  graph: Graph | any;
  constructor(id: string, graph: Graph) {
    this.id = id;
    this.graph = graph;
  }

  addEdges(id: string, edges: any[]) {
    if (edges) {
      const target = id;
      edges.forEach((e: any) => {
        const { source, ...attrs } = e;
        this.graph.addEdge(source, target, { ...attrs });
      });
    }
  }

  addNodes(options: any) {
    const { id, edges, ...attributes } = options;
    this.graph.addNode(id, { ...attributes });
    this.addEdges(id, edges);
  }

  addStart(options: any) {
    this.addNodes({ ...options, type: 'Start' });
    return this;
  }

  addTask(options: any) {
    this.addNodes({ ...options, type: 'Task' });
    return this;
  }

  addSwitch(options: any) {
    this.addNodes({ ...options, type: 'Switch' });
    return this;
  }

  addStop(options: any) {
    this.addNodes({ ...options, type: 'Stop' });
    return this;
  }
  toJson() {
    const nodes: any = [];
    const links: any = [];
    let nodeCount = 0;
    this.graph.forEachNode((id: any, attrs: any) => {
      const shape = nodeTypeToNodeShape(attrs.type);
      const color = nodeTypeToNodeColor(attrs.type);
      const opacity = attrs.opacity || 1;
      nodes.push({ id, shape, color, opacity, number: nodeCount, ...attrs });
      nodeCount++;
    });

    this.graph.forEachEdge((id: any, attrs: any, source: any, target: any) => {
      const opacity = attrs.opacity || 1;
      const color = edgeTypeToEdgeColor(attrs.type);
      links.push({ id, source, target, color, opacity, ...attrs });
    });
    return { nodes, links };
  }
  toBpmn() {
    return getXmlFromJsonGraph(this.toJson());
  }
}
