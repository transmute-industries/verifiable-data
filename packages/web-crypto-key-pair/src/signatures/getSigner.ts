import { subtle } from '../crypto';
import { JsonWebKey2020, Signer, SignerOptions } from '../types';
import { getCryptoKeyFromJsonWebKey2020 } from '../key/getCryptoKeyFromJsonWebKey2020';

import { getSignatureOptionsFromCryptoKey } from './getSignatureOptionsFromCryptoKey';

export const getSigner = (k: JsonWebKey2020 | CryptoKey): Signer => {
  return {
    sign: async ({ data }: SignerOptions): Promise<Uint8Array> => {
      let cryptoKey = k as CryptoKey;

      if (k.type === 'JsonWebKey2020') {
        cryptoKey = await getCryptoKeyFromJsonWebKey2020(k);
      }
      const signature = await subtle.sign(
        getSignatureOptionsFromCryptoKey(cryptoKey),
        cryptoKey,
        Buffer.from(data)
      );
      return new Uint8Array(signature);
    },
  };
};
