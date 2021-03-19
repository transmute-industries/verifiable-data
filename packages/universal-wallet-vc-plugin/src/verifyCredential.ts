import { ld } from '@transmute/vc.js';

import { VerifyCredential } from './types';

const vcjs = ld;

const verifyCredential = ({ credential, options }: VerifyCredential) => {
  return vcjs.verifyCredential({
    credential,
    suite: options.suite,
    documentLoader: options.documentLoader,
  });
};

export { verifyCredential };
