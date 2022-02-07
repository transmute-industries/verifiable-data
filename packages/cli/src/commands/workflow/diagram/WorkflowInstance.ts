import Graph from 'graphology';

export interface WorkflowInstanceOptions {
  id: string;
  definition?: string;
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
  const t = Array.isArray(type) ? type[0] : type;
  switch (t) {
    case 'WorkflowDefinition':
      return colors.pink;
    case 'WorkflowInstance':
      return colors.green;
    case 'VerifiablePresentation':
      return colors.blue;
    case 'VerifiableCredential':
      return colors.gold;
    case 'Stop':
      return colors.red;
    default:
      return '#fff';
  }
};

const nodeTypeToNodeShape = (type: any) => {
  const t = Array.isArray(type) ? type[0] : type;
  switch (t) {
    case 'WorkflowInstance':
      return 'torus';
    case 'WorkflowDefinition':
      return 'torus';
    case 'VerifiablePresentation':
      return 'cube';
    case 'VerifiableCredential':
      return 'dodecahedron';
    case 'Stop':
      return 'torus';
    default:
      return 'sphere';
  }
};

export class WorkflowInstance {
  id: string;
  definitionId?: string;
  type: string = 'WorkflowInstance';
  graph: Graph | any;
  constructor(id: string, graph: Graph, definitionId?: string) {
    this.id = id;
    this.definitionId = definitionId;
    this.graph = graph;
  }

  annotateCredential = (credential: any) => {
    const instance = [this.id];
    const definition = [this.definitionId];
    const workflow: any = { instance };
    if (this.definitionId) {
      workflow.definition = definition;
    }
    return { workflow, ...credential };
  };

  annotatePresentation = (presentation: any) => {
    const instance = [this.id];
    const definition = [this.definitionId];
    const workflow: any = { instance };
    if (this.definitionId) {
      workflow.definition = definition;
    }
    return { workflow, ...presentation };
  };

  addPresentation(vp: any) {
    if (!this.graph.hasNode(vp.id)) {
      this.addNodes({
        ...vp,
        name: vp.type,
      });
    }

    vp.verifiableCredential.forEach((vc: any) => {
      if (!this.graph.hasNode(vc.id)) {
        this.addNodes({
          ...vc,
          name: vc.type,
          edges: [
            {
              source: vp.id,
              name: 'includes',
            },
          ],
        });
      }
    });

    if (vp.workflow && vp.workflow.instance) {
      const workflowInstances = Array.isArray(vp.workflow.instance)
        ? vp.workflow.instance
        : [vp.workflow.instance];

      workflowInstances.forEach((wfi: any) => {
        if (!this.graph.hasNode(wfi)) {
          this.addNodes({
            id: wfi,
            name: 'Instance',
            type: 'WorkflowInstance',
          });
        }
        this.addEdges(wfi, [
          {
            source: vp.id,
            name: 'updates',
          },
        ]);
      });
    }

    if (vp.workflow && vp.workflow.definition) {
      const workflowDefinitions = Array.isArray(vp.workflow.definition)
        ? vp.workflow.definition
        : [vp.workflow.definition];

      workflowDefinitions.forEach((wfd: any) => {
        if (!this.graph.hasNode(wfd)) {
          this.addNodes({
            id: wfd,
            name: 'Definition',
            type: 'WorkflowDefinition',
          });
        }
        this.addEdges(wfd, [
          {
            source: vp.id,
            name: 'refers to',
          },
        ]);
      });
    }
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

  toJson() {
    const nodes: any = [];
    const links: any = [];
    this.graph.forEachNode((id: any, attrs: any) => {
      const shape = nodeTypeToNodeShape(attrs.type);
      const color = nodeTypeToNodeColor(attrs.type);
      const opacity = attrs.opacity || 1;
      nodes.push({ id, shape, color, opacity, ...attrs });
    });

    this.graph.forEachEdge((_id: any, attrs: any, source: any, target: any) => {
      const opacity = attrs.opacity || 1;
      const color = edgeTypeToEdgeColor(attrs.type);
      links.push({ source, target, color, opacity, ...attrs });
    });
    return { nodes, links };
  }
}
