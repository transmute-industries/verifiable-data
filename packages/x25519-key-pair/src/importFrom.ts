import { JsonWebKey2020, X25519KeyAgreementKey2019 } from './types';

import { getPublicKeyFromPublicKeyJwk } from './getPublicKeyFromPublicKeyJwk';
import { getKeyPairFromPrivateKeyJwk } from './getKeyPairFromPrivateKeyJwk';
import { base58 } from './encoding';

export const fromJsonWebKey2020 = (
  k: JsonWebKey2020
): { publicKey: Uint8Array; privateKey?: Uint8Array } => {
  const publicKey = getPublicKeyFromPublicKeyJwk(k.publicKeyJwk);
  let privateKey = undefined;
  if (k.privateKeyJwk) {
    ({ privateKey } = getKeyPairFromPrivateKeyJwk(k.privateKeyJwk));
  }
  return { publicKey, privateKey };
};

export const fromX25519KeyAgreementKey2019 = (
  k: X25519KeyAgreementKey2019
): { publicKey: Uint8Array; privateKey?: Uint8Array } => {
  const publicKey = base58.decode(k.publicKeyBase58);
  let privateKey = undefined;
  if (k.privateKeyBase58) {
    privateKey = Uint8Array.from(base58.decode(k.privateKeyBase58));
  }
  return { publicKey, privateKey };
};

export const importableTypes = {
  JsonWebKey2020: fromJsonWebKey2020,
  X25519KeyAgreementKey2019: fromX25519KeyAgreementKey2019,
};
