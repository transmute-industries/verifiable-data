import { getCredentialFromFile, handleCommandResponse } from '../../util';

import * as api from '../../vc-api';

export const verifyCredentialCommand = [
  'credential verify',
  'Verify a verifiable credential',
  {
    input: {
      alias: 'i',
      description: 'Path to input document',
      demandOption: true,
    },
    output: {
      alias: 'o',
      description: 'Path to output document',
      demandOption: true,
    },
    endpoint: {
      alias: 'e',
      stype: 'string',
      description: 'Endpoint to use to verify',
      default: 'https://api.did.actor/api/credentials/verify',
    },
    access_token: {
      alias: 'a',
      stype: 'string',
      description: 'Authorization token to use',
    },
  },
  async (argv: any) => {
    if (argv.debug) {
      console.log(argv);
    }
    let credential = getCredentialFromFile(argv.input);
    const opts: any = {
      endpoint: argv.endpoint,
      verifiableCredential: credential,
    };
    if (argv.access_token) {
      opts.access_token = argv.access_token;
    }
    const data = await api.verify(opts);
    handleCommandResponse(argv, data, argv.output);
  },
];
