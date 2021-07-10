import { ProofSet } from './ProofSet';
import { VerificationError } from './VerificationError';
import { IVerifyOptions } from './types';
export const verify = async (
  document: any,
  {
    suite,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: IVerifyOptions = {}
) => {
  const result = await new ProofSet().verify(document, {
    suite,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  });
  const { error } = result;
  if (error) {
    if (!documentLoader && error.name === 'jsonld.InvalidUrl') {
      const {
        details: { url },
      } = error;
      const urlError = new Error(
        `A URL "${url}" could not be fetched; you need to pass ` +
          '"documentLoader" or resolve the URL before calling "verify".'
      );
      result.error = new VerificationError(urlError);
    } else {
      result.error = new VerificationError(error);
    }
  }
  return result;
};
