import { JsonWebKey2020 } from '../types';

import { getCryptoKeyFromJsonWebKey2020 } from './getCryptoKeyFromJsonWebKey2020';

export const getCryptoKeyPairFromJsonWebKey2020 = async (
  k: JsonWebKey2020,
  derive = false
): Promise<{
  publicKey: CryptoKey;
  privateKey?: CryptoKey;
}> => {
  let keypair: any = {};
  if (k.publicKeyJwk) {
    keypair.publicKey = await getCryptoKeyFromJsonWebKey2020(
      {
        publicKeyJwk: k.publicKeyJwk,
      } as any,
      derive
    );
  }
  if (k.privateKeyJwk) {
    keypair.privateKey = await getCryptoKeyFromJsonWebKey2020(
      {
        privateKeyJwk: k.privateKeyJwk,
      } as any,
      derive
    );
  }
  return keypair;
};
