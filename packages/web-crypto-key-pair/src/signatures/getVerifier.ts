import { subtle } from '../crypto';
import { JsonWebKey2020, Verifier, VerifierOptions } from '../types';

import { getCryptoKeyFromJsonWebKey2020 } from '../key/getCryptoKeyFromJsonWebKey2020';

import { getSignaturOptionsFromCryptoKey } from './getSignaturOptionsFromCryptoKey';

export const getVerifier = async (
  k: JsonWebKey2020 | CryptoKey,
  opts = { ignorePrivateKey: false }
): Promise<Verifier> => {
  let cryptoKey = k as CryptoKey;
  if (k.type === 'JsonWebKey2020') {
    if (k.privateKeyJwk) {
      if (!opts.ignorePrivateKey) {
        throw new Error('verification method contained private key!');
      }
      delete k.privateKeyJwk;
    }
    cryptoKey = await getCryptoKeyFromJsonWebKey2020(k);
  }

  return {
    verify: async (opts: VerifierOptions): Promise<boolean> => {
      const verified = await subtle.verify(
        getSignaturOptionsFromCryptoKey(cryptoKey),
        cryptoKey,
        opts.signature,
        opts.data
      );
      return verified;
    },
  };
};
