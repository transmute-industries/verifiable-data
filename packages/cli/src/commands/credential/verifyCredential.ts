import axios from 'axios';
import { getCredentialFromFile, handleCommandResponse } from '../../util';

export const verifyCredential = async (credential: any, endpoint: string) => {
  const res = await axios.post(endpoint, {
    verifiableCredential: credential,
  });
  return res.data;
};

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
  },
  async (argv: any) => {
    if (argv.debug) {
      console.log(argv);
    }
    let credential = getCredentialFromFile(argv.input);
    const data = await verifyCredential(credential, argv.endpoint);
    handleCommandResponse(argv, data, argv.output);
  },
];
