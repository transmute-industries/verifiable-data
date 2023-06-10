import secp256k1 from 'secp256k1';
import { base58, base64url } from './encoding';
import {
  JsonWebKey2020,
  EcdsaSecp256k1VerificationKey2019,
  EcdsaSecp256k1VerificationKey2020,
} from './types';

import { getMultibaseFingerprintFromPublicKeyBytes } from './getMultibaseFingerprintFromPublicKeyBytes';

export const toJsonWebKey2020 = (
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array,
  alg?: string
) => {
  // assume 0x04
  const expandedPublicKey = secp256k1.publicKeyConvert(
    publicKey,
    false,
    new Uint8Array(65)
  );
  const x = Buffer.from(expandedPublicKey)
    .toString('hex')
    .substr(2, 64);

  const y = Buffer.from(expandedPublicKey)
    .toString('hex')
    .substr(66);

  const publicKeyJwk = {
    kty: 'EC',
    crv: 'secp256k1',
    alg,
    x: base64url.encode(Buffer.from(x, 'hex')),
    y: base64url.encode(Buffer.from(y, 'hex')),
  };
  const k: JsonWebKey2020 = {
    id: id,
    type: 'JsonWebKey2020',
    controller: controller,
    publicKeyJwk,
  };
  if (privateKey) {
    k.privateKeyJwk = {
      ...publicKeyJwk,
      d: base64url.encode(privateKey),
    };
  }
  return k;
};

export const toEcdsaSecp256k1VerificationKey2019 = (
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array
) => {
  const k: EcdsaSecp256k1VerificationKey2019 = {
    id: id,
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: controller,
    publicKeyBase58: base58.encode(publicKey),
  };
  if (privateKey) {
    k.privateKeyBase58 = base58.encode(privateKey);
  }
  return k;
};

export const toEcdsaSecp256k1VerificationKey2020 = (
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array
) => {
  const k: EcdsaSecp256k1VerificationKey2020 = {
    id: id,
    type: 'EcdsaSecp256k1VerificationKey2020',
    controller: controller,
    publicKeyMultibase: getMultibaseFingerprintFromPublicKeyBytes(publicKey),
  };
  if (privateKey) {
    throw new Error(
      'Unable to represent secp256k1 private key in multibase. See https://github.com/multiformats/multicodec/pull/210'
    );
  }
  return k;
};

export const exportableTypes = {
  JsonWebKey2020: toJsonWebKey2020,
  EcdsaSecp256k1VerificationKey2020: toEcdsaSecp256k1VerificationKey2020,
  EcdsaSecp256k1VerificationKey2019: toEcdsaSecp256k1VerificationKey2019,
};
