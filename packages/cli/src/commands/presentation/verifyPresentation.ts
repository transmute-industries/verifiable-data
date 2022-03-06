import { getPresentationFromFile, handleCommandResponse } from '../../util';
import * as api from '../../vc-api';

export const verifyPresentationHandler = async (argv: any) => {
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
};
