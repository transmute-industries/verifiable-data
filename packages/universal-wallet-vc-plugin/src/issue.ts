import { ld } from '@transmute/vc.js';

import { IssueCredential } from './types';

const vcjs = ld;

const issue = async ({ credential, options }: IssueCredential) => {
  const signedVC = await vcjs.issue({
    credential,
    suite: options.suite,
    documentLoader: options.documentLoader,
  });
  return signedVC;
};

export { issue };
