import { subtle } from '../crypto';
import { JsonWebKey2020, Verifier, VerifierOptions } from '../types';

import { getCryptoKeyFromJsonWebKey2020 } from '../key/getCryptoKeyFromJsonWebKey2020';

import { getSignatureOptionsFromCryptoKey } from './getSignatureOptionsFromCryptoKey';

export const getVerifier = (
  k: JsonWebKey2020 | CryptoKey,
  opts = { ignorePrivateKey: false }
): Verifier => {
  return {
    verify: async ({ signature, data }: VerifierOptions): Promise<boolean> => {
      let cryptoKey = k as CryptoKey;
      if (k.type === 'JsonWebKey2020') {
        if (k.privateKeyJwk) {
          if (!opts.ignorePrivateKey) {
            throw new Error('verification method contained private key!');
          }
        }
        cryptoKey = await getCryptoKeyFromJsonWebKey2020(k);
      }
      let verified = false;
      try {
        verified = await subtle.verify(
          getSignatureOptionsFromCryptoKey(cryptoKey),
          cryptoKey,
          signature,
          data
        );
      } catch (e) {
        // do nothing
        // console.warn(signature, data, e);
      }

      return verified;
    },
  };
};
