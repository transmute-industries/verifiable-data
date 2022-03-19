import { keyTypeOptions } from '../options';

import { signJwt } from './signJwt';
import { verifyJwt } from './verifyJwt';

export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'jose [operationType]',
    describe: 'See https://www.iana.org/assignments/jose/jose.xhtml',
    handler: (argv: any) => {
      const dispatchHandler: any = {
        sign: signJwt,
        verify: verifyJwt,
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
        choices: ['sign', 'verify'],
      },
      input: {
        alias: 'i',
        description: 'Path to input document',
      },
      output: {
        alias: 'o',
        description: 'Path to output document',
      },
      username: {
        alias: 'u',
        description: 'GitHub username',
      },
      repository: {
        alias: 'r',
        description: 'GitHub repository',
      },
      mnemonic: {
        alias: 'm',
        description: 'Mnemonic to derive key',
      },
      hdpath: {
        alias: 'hd',
        description: 'HD Path to derive key',
      },
      type: keyTypeOptions,
      kid: {
        alias: 'kid',
        description:
          'The id of the key used to sign, also known as verificationMethod',
      },
    },
  });
};
