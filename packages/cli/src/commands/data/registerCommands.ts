import { createDataHandler } from './createData';

import { issuerTypeGenerators } from './generate/simpleTypeGenerators';

export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'data [operationType]',
    describe: 'See https://www.w3.org/TR/vc-data-model/#lifecycle-details',
    handler: (argv: any) => {
      const dispatchHandler: any = {
        create: createDataHandler,
      };
      if (dispatchHandler[argv.operationType]) {
        return dispatchHandler[argv.operationType](argv);
      } else {
        throw new Error('Unsupported operationType');
      }
    },
    builder: {
      operationType: {
        demand: true,
        choices: ['create'],
      },
    },
    seed: {
      alias: 's',
      description: 'Seed to generate key from',
    },
    type: {
      alias: 't',
      description: 'Type of key to derive',
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
    credentialsDirectory: {
      alias: 'vcd',
      type: 'string',
      description: 'The directory containing credentials to present.',
    },
  });
};
