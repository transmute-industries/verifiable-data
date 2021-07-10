import { ProofSet } from './ProofSet';

import { ISignOptions } from './types';

export const sign = async (
  document: any,
  {
    suite,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: ISignOptions = {
    compactProof: true,
  }
) => {
  try {
    return await new ProofSet().add(document, {
      suite,
      purpose,
      documentLoader,
      expansionMap,
      compactProof,
    });
  } catch (e) {
    if (!documentLoader && e.name === 'jsonld.InvalidUrl') {
      const {
        details: { url },
      } = e;
      const err: any = new Error(
        `A URL "${url}" could not be fetched;` +
          `you need to pass "documentLoader" or resolve the URL before calling "sign".`
      );
      err.cause = e;
      throw err;
    }
    throw e;
  }
};
