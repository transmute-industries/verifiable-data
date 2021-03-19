import { ld } from '@transmute/vc.js';

import { VerifyPresentation } from './types';

const vcjs = ld;

const verifyPresentation = ({ presentation, options }: VerifyPresentation) => {
  return vcjs.verify({
    presentation,
    ...options,
  });
};

export { verifyPresentation };
