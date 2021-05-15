import { base58, base64url } from './encoding';
import {
  JsonWebKey2020,
  Bls12381G1Key2020,
  Bls12381G2Key2020,
  BlsCurveName,
} from './types';

export const toJsonWebKey2020 = (
  crv: string,
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array
) => {
  const publicKeyJwk = {
    kty: 'EC',
    crv,
    x: base64url.encode(publicKey),
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

export const toBls12381G1Key2020 = (
  crv: string,
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array
) => {
  if (crv !== BlsCurveName.G1) {
    throw new Error('Unexpected curve name: ' + crv);
  }
  const k: Bls12381G1Key2020 = {
    id: id,
    type: 'Bls12381G1Key2020',
    controller: controller,
    publicKeyBase58: base58.encode(publicKey),
  };
  if (privateKey) {
    k.privateKeyBase58 = base58.encode(privateKey);
  }
  return k;
};

export const toBls12381G2Key2020 = (
  crv: string,
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array
) => {
  if (crv !== BlsCurveName.G2) {
    throw new Error('Unexpected curve name: ' + crv);
  }
  const k: Bls12381G2Key2020 = {
    id: id,
    type: 'Bls12381G2Key2020',
    controller: controller,
    publicKeyBase58: base58.encode(publicKey),
  };
  if (privateKey) {
    k.privateKeyBase58 = base58.encode(privateKey);
  }
  return k;
};

export const exportableTypes = {
  JsonWebKey2020: toJsonWebKey2020,
  Bls12381G1Key2020: toBls12381G1Key2020,
  Bls12381G2Key2020: toBls12381G2Key2020,
};
