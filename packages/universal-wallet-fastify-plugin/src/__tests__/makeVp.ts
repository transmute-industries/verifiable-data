import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018,
} from '@transmute/ed25519-signature-2018';

import { documentLoader } from '../__fixtures__/documentLoader';

export const makeVp = async (
  wallet: any,
  verifiableCredential: any[],
  domain: string,
  challenge: string
) => {
  const signingKey = wallet.contents[0];
  return wallet.createVerifiablePresentation({
    verifiableCredential: verifiableCredential,
    options: {
      documentLoader,
      holder: signingKey.controller,
      challenge,
      domain,
      suite: new Ed25519Signature2018({
        key: await Ed25519VerificationKey2018.from(signingKey),
      }),
    },
  });
};
