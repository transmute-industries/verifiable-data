import { simpleTypeGenerators } from './simpleTypeGenerators';

import { generateWorkflowInstance } from './generateWorkflowInstance';
export const typeGenerators: any = {
  ...simpleTypeGenerators,
};

typeGenerators.WorkflowInstance = generateWorkflowInstance;
