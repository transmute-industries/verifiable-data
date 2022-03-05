import { getPresentationFromFile, handleCommandResponse } from '../../util';
import * as api from '../../vc-api';

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
    let presentation = getPresentationFromFile(argv.input);
    const opts: any = {
      endpoint: argv.endpoint,
      verifiablePresentation: presentation,
      options: {
        challenge: presentation.proof.challenge,
      },
    };
    if (argv.access_token) {
      opts.access_token = argv.access_token;
    }
    if (presentation.proof.domain) {
      opts.options.domain = presentation.proof.domain;
    }
    const data = await api.verify(opts);
    handleCommandResponse(argv, data, argv.output);
  },
];
