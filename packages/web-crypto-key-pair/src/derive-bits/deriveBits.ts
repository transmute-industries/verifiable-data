import { subtle } from '../crypto';
import { JsonWebKey2020 } from '../types';

import { getCryptoKeyFromJsonWebKey2020 } from '../key/getCryptoKeyFromJsonWebKey2020';

export const deriveBits = async (
  localPrivateKey: JsonWebKey2020,
  remotePublicKey: JsonWebKey2020
): Promise<Uint8Array> => {
  if (localPrivateKey.privateKeyJwk.kty === 'RSA') {
    throw new Error('deriveBits is not supported on this key type');
  }
  const privateKey = await getCryptoKeyFromJsonWebKey2020(
    {
      privateKeyJwk: localPrivateKey.privateKeyJwk,
      publicKeyJwk: localPrivateKey.publicKeyJwk,
    } as any,
    true
  );
  const publicKey = await getCryptoKeyFromJsonWebKey2020(
    { publicKeyJwk: remotePublicKey.publicKeyJwk } as any,
    true
  );

  if (remotePublicKey.publicKeyJwk.kty !== localPrivateKey.privateKeyJwk.kty) {
    throw new Error(
      `local and remote kty must match: ${remotePublicKey.publicKeyJwk.kty} ${localPrivateKey.privateKeyJwk.kty}`
    );
  }

  return new Uint8Array(
    await subtle.deriveBits(
      {
        name: 'ECDH',
        public: publicKey,
      },
      privateKey as CryptoKey,
      256
    )
  );
};
