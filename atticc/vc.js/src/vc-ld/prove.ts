import { sign } from '@transmute/linked-data-proof';
import { checkPresentation } from './checkPresentation';
import { checkCredential } from './checkCredential';
import constants from './constants';

import { AuthenticationProofPurpose } from './purposes';

export const createPresentation = async ({
  verifiableCredential,
  id,
  holder,
  documentLoader,
}: any = {}) => {
  const presentation: any = {
    '@context': [constants.CREDENTIALS_CONTEXT_V1_URL],
    type: ['VerifiablePresentation'],
  };
  if (verifiableCredential) {
    const credentials = [].concat(verifiableCredential);
    // ensure all credentials are valid
    for (const credential of credentials) {
      await checkCredential(credential, documentLoader);
    }
    presentation.verifiableCredential = credentials;
  }
  if (id) {
    presentation.id = id;
  }
  if (holder) {
    presentation.holder = holder;
  }

  checkPresentation(presentation);

  return presentation;
};

export const signPresentation = async (options: any = {}) => {
  const { presentation, domain, challenge, documentLoader } = options;
  const purpose =
    options.purpose ||
    new AuthenticationProofPurpose({
      domain,
      challenge,
    });

  if (!documentLoader) {
    throw new TypeError('"documentLoader" parameter is required for issuing.');
  }

  return sign(presentation, { purpose, ...options });
};
