import { v4 as uuidv4 } from 'uuid';
import Graph from 'graphology';
import {
  WorkflowDefinition,
  WorkflowDefintionOptions,
} from './WorkflowDefinition';

import { WorkflowInstance, WorkflowInstanceOptions } from './WorkflowInstance';

export const workflow = {
  definition: {
    id: (): string => uuidv4(),
    create: (options: WorkflowDefintionOptions) => {
      const id = options.id || uuidv4();
      const graph = new Graph();
      return new WorkflowDefinition(id, graph);
    },
  },
  instance: {
    id: (): string => uuidv4(),
    create: (options: WorkflowInstanceOptions) => {
      const id = options.id || uuidv4();
      const graph = new Graph();
      return new WorkflowInstance(id, graph, options.definition);
    },
  },
};
