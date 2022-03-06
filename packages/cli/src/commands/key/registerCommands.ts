import { generateKeyHandler } from './generate';

import { keyTypeOptions } from '../options';

export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'key [operationType]',
    describe: 'Manage key material',
    handler: (argv: any) => {
      const dispatchHandler: any = {
        generate: generateKeyHandler,
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
        choices: ['generate'],
      },
      mnemonic: {
        alias: 'm',
        description: 'Mnemonic to derive key',
      },
      hdpath: {
        alias: 'hd',
        description: 'HD Path to derive key',
      },
      seed: {
        alias: 's',
        description: 'Seed to generate key from',
      },
      type: keyTypeOptions,
      output: {
        alias: 'o',
        description: 'Path to output document',
      },
    },
  });
};
