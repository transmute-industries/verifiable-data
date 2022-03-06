import { createCredentialHandler } from './createCredential';
import { verifyCredentialHandler } from './verifyCredential';
import {
  setStatusListIndexHandler,
  isStatusListIndexSetHandler,
} from './statusList';

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
        ],
      },
    },
  });
};
