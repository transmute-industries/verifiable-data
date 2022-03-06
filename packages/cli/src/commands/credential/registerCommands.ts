import { createCredentialHandler } from './createCredential';
import { verifyCredentialHandler } from './verifyCredential';
import {
  setStatusListIndexHandler,
  isStatusListIndexSetHandler,
} from './statusList';

import { keyTypeOptions } from '../options';

import { registryIndexRefreshHandler } from './registryIndexRefresh';
export const registerCommands = (yargs: any) => {
  yargs.command({
    command: 'credential [operationType]',
    describe: 'See https://www.w3.org/TR/vc-data-model/#credentials',
    handler: (argv: any) => {
      const dispatchHandler: any = {
        create: createCredentialHandler,
        verify: verifyCredentialHandler,
        setStatusListIndex: setStatusListIndexHandler,
        isStatusListIndexSet: isStatusListIndexSetHandler,
        registryIndexRefresh: registryIndexRefreshHandler,
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
        choices: [
          'create',
          'verify',
          'setStatusListIndex',
          'isStatusListIndexSet',
          'registryIndexRefresh',
        ],
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
        choices: ['vc', 'vc-jwt'],
        description: 'Output format',
        default: 'vc',
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
      credentialIndex: {
        alias: 'ci',
        description: 'Status List Credential index',
      },
      status: {
        alias: 's',
        description: 'Status in Status List',
      },
    },
  });
};
