import { base58, base64url } from './encoding';
import { JsonWebKey2020, Ed25519VerificationKey2018 } from './types';

export const toJsonWebKey2020 = (
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array
) => {
  const publicKeyJwk = {
    kty: 'OKP',
    crv: 'Ed25519',
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
      d: base64url.encode(privateKey.slice(0, privateKey.length / 2)),
    };
  }
  return k;
};

export const toX25519KeyAgreementKey2019 = (
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array
) => {
  const k: Ed25519VerificationKey2018 = {
    id: id,
    type: 'Ed25519VerificationKey2018',
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
  Ed25519VerificationKey2018: toX25519KeyAgreementKey2019,
};
