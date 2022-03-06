import { createPresentationHandler } from './createPresentation';
import { verifyPresentationHandler } from './verifyPresentation';
import { keyTypeOptions } from '../options';

export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'presentation [operationType]',
    describe: 'See https://www.w3.org/TR/vc-data-model/#presentations',
    handler: (argv: any) => {
      const dispatchHandler: any = {
        create: createPresentationHandler,
        verify: verifyPresentationHandler,
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
        choices: ['create', 'verify'],
      },
    },
    input: {
      alias: 'i',
      description: 'Path to input document',
    },
    output: {
      alias: 'o',
      description: 'Path to output document',
    },
    key: {
      alias: 'k',
      description: 'Path to key',
    },
    type: keyTypeOptions,
    format: {
      alias: 'f',
      choices: ['vp', 'vp-jwt'],
      description: 'Output format',
      default: 'vp',
    },
    endpoint: {
      alias: 'e',
      stype: 'string',
      description: 'Endpoint to use to issue',
    },
    access_token: {
      alias: 'a',
      stype: 'string',
      description: 'Authorization token to use',
    },
    domain: {
      alias: 'd',
      type: 'string',
      description: 'Domain from the holder',
    },
    challenge: {
      alias: 'c',
      type: 'string',
      description: 'Challenge from the verifier',
    },
  });
};
