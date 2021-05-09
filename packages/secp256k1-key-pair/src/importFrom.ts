import {
  JsonWebKey2020,
  EcdsaSecp256k1VerificationKey2020,
  EcdsaSecp256k1VerificationKey2019,
} from './types';

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

export const fromEcdsaSecp256k1VerificationKey2019 = (
  k: EcdsaSecp256k1VerificationKey2019
): { publicKey: Uint8Array; privateKey?: Uint8Array } => {
  return {
    publicKey: base58.decode(k.publicKeyBase58),
    privateKey: k.privateKeyBase58
      ? base58.decode(k.privateKeyBase58)
      : undefined,
  };
};

export const fromEcdsaSecp256k1VerificationKey2020 = (
  _k: EcdsaSecp256k1VerificationKey2020
): { publicKey: Uint8Array; privateKey?: Uint8Array } => {
  throw new Error(
    'EcdsaSecp256k1VerificationKey2020 cannot be imported becuase it does not support private keys.'
  );
};

export const importableTypes = {
  JsonWebKey2020: fromJsonWebKey2020,
  EcdsaSecp256k1VerificationKey2020: fromEcdsaSecp256k1VerificationKey2020,
  EcdsaSecp256k1VerificationKey2019: fromEcdsaSecp256k1VerificationKey2019,
};
