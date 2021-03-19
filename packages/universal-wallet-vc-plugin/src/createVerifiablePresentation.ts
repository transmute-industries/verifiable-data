import { ld } from '@transmute/vc.js';

import { PresentCredentials } from './types';

const vcjs = ld;

const createVerifiablePresentation = ({
  verifiableCredential,
  options,
}: PresentCredentials) => {
  const presentation = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    holder: options.holder,
    verifiableCredential,
  };

  return vcjs.signPresentation({
    presentation,
    suite: options.suite,
    challenge: options.challenge,
    domain: options.domain,
    documentLoader: options.documentLoader,
  });
};

export { createVerifiablePresentation };
