import {
  generateOrganization,
  generateProduct,
  generateDevice,
  generateCredential,
  generatePresentation,
} from './generate';

import { handleCommandResponse } from '../../util';

const issuerTypeGenerators: any = {
  Organization: generateOrganization,
  Device: generateDevice,
};

const typeGenerators: any = {
  ...issuerTypeGenerators,
  Product: generateProduct,
};

// for all base types create credential types from them.
Object.keys(typeGenerators).forEach((k: string) => {
  typeGenerators['Certified' + k] = generateCredential;
});

typeGenerators.VerifiablePresentation = generatePresentation;

export const createDataCommand = [
  'data create',
  'Create data',
  {
    type: {
      alias: 't',
      choices: Object.keys(typeGenerators),
      description: 'Type of data to create',
      demandOption: true,
    },
    seed: {
      alias: 's',
      type: 'number',
      description:
        'Seed for deriving random values for the given type. This value is low entropy and for testing purposes only.',
    },
    output: {
      alias: 'o',
      description: 'Path to output document',
      demandOption: true,
    },

    // These options to be used for "Certified" type generators
    issuerType: {
      alias: 'it',
      choices: Object.keys(issuerTypeGenerators),
      description: 'Type of issuer to create from',
    },
    issuerSeed: {
      alias: 'is',
      type: 'number',
      description:
        'Seed for deriving random values. This value is low entropy and for testing purposes only.',
    },
    subjectSeed: {
      alias: 'ss',
      type: 'number',
      description:
        'Seed for deriving random values. This value is low entropy and for testing purposes only.',
    },

    // These options to be used for Presentations
    holderType: {
      alias: 'ht',
      choices: Object.keys(issuerTypeGenerators),
      description: 'Type of holder to present from',
    },
    holderSeed: {
      alias: 'hs',
      type: 'number',
      description:
        'Seed for deriving random values. This value is low entropy and for testing purposes only.',
    },

    domain: {
      alias: 'd',
      type: 'string',
      description: 'Domain of the verifier',
    },
    challenge: {
      alias: 'c',
      type: 'string',
      description: 'Challenge from the verifier',
    },
    credentialsDirectory: {
      alias: 'vcd',
      type: 'string',
      description: 'The directory containing credentials to present.',
    },
  },

  async (argv: any) => {
    if (argv.debug) {
      console.log(argv);
    }
    const data = await typeGenerators[argv.type](argv, typeGenerators);
    handleCommandResponse(argv, data, argv.output);
  },
];
