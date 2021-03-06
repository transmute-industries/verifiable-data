import { subtle } from '../crypto';
import { JsonWebKey2020, Signer, SignerOptions } from '../types';
import { getCryptoKeyFromJsonWebKey2020 } from './getCryptoKeyFromJsonWebKey2020';

import { getSignaturOptionsFromCryptoKey } from './getSignaturOptionsFromCryptoKey';

export const getSigner = async (
  k: JsonWebKey2020 | CryptoKey
): Promise<Signer> => {
  let cryptoKey = k as CryptoKey;

  if (k.type === 'JsonWebKey2020') {
    cryptoKey = await getCryptoKeyFromJsonWebKey2020(k);
  }

  return {
    sign: async ({ data }: SignerOptions): Promise<Uint8Array> => {
      const signature = await subtle.sign(
        getSignaturOptionsFromCryptoKey(cryptoKey),
        cryptoKey,
        data
      );
      return new Uint8Array(signature);
    },
  };
};
