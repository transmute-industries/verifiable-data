import { getCredentialFromFile, handleCommandResponse } from '../../util';

import * as api from '../../vc-api';

export const verifyCredentialHandler = async (argv: any) => {
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
};
