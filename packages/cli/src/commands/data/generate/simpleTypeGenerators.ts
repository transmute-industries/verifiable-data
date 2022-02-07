import { generateOrganization } from './generateOrganization';
import { generatePerson } from './generatePerson';
import { generateProduct } from './generateProduct';
import { generateDevice } from './generateDevice';
import { generateCredential } from './generateCredential';
import { generatePresentation } from './generatePresentation';

export const issuerTypeGenerators: any = {
  Organization: generateOrganization,
  Person: generatePerson,
  Device: generateDevice,
};

export const simpleTypeGenerators: any = {
  ...issuerTypeGenerators,
  Product: generateProduct,
};

// for all base types create credential types from them.
Object.keys(simpleTypeGenerators).forEach((k: string) => {
  simpleTypeGenerators['Certified' + k] = generateCredential;
});

simpleTypeGenerators.VerifiablePresentation = generatePresentation;
