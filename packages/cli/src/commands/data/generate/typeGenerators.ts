import { generateOrganization } from './generateOrganization';
import { generateProduct } from './generateProduct';
import { generateDevice } from './generateDevice';
import { generateCredential } from './generateCredential';
import { generatePresentation } from './generatePresentation';
import { generateWorkflowDefinition } from './generateWorkflowDefinition';
import { generateWorkflowInstance } from './generateWorkflowInstance';

export const issuerTypeGenerators: any = {
  Organization: generateOrganization,
  Device: generateDevice,
};

export const typeGenerators: any = {
  ...issuerTypeGenerators,
  Product: generateProduct,
};

// for all base types create credential types from them.
Object.keys(typeGenerators).forEach((k: string) => {
  typeGenerators['Certified' + k] = generateCredential;
});

typeGenerators.VerifiablePresentation = generatePresentation;
typeGenerators.WorkflowDefinition = generateWorkflowDefinition;
typeGenerators.WorkflowInstance = generateWorkflowInstance;
