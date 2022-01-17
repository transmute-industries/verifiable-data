import axios from 'axios';
import { getPresentationFromFile, handleCommandResponse } from '../../util';

export const verifyPresenation = async (
  presentation: any,
  endpoint: string
) => {
  const options: any = {};
  if (presentation.proof.domain) {
    options.domain = presentation.proof.domain;
  }

  if (presentation.proof.challenge) {
    options.challenge = presentation.proof.challenge;
  }
  const res = await axios.post(endpoint, {
    verifiablePresentation: presentation,
    options,
  });
  return res.data;
};

export const verifyPresentationCommand = [
  'presentation verify',
  'Verify a verifiable presentation',
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
      default: 'https://api.did.actor/api/presentations/verify',
    },
  },
  async (argv: any) => {
    if (argv.debug) {
      console.log(argv);
    }
    let presentation = getPresentationFromFile(argv.input);
    const data = await verifyPresenation(presentation, argv.endpoint);
    handleCommandResponse(argv, data, argv.output);
  },
];
