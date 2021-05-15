import { JsonWebKey2020, Bls12381G1Key2020, Bls12381G2Key2020 } from './types';

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

export const fromBls12381G1Key2020 = (
  k: Bls12381G1Key2020
): { publicKey: Uint8Array; privateKey?: Uint8Array } => {
  const publicKey = base58.decode(k.publicKeyBase58);
  let privateKey = undefined;
  if (k.privateKeyBase58) {
    privateKey = Uint8Array.from(base58.decode(k.privateKeyBase58));
  }
  return { publicKey, privateKey };
};

export const fromBls12381G2Key2020 = (
  k: Bls12381G2Key2020
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
  Bls12381G1Key2020: fromBls12381G1Key2020,
  Bls12381G2Key2020: fromBls12381G2Key2020,
};
