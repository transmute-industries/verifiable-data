import { base58, base64url } from './encoding';
import { JsonWebKey2020, X25519KeyAgreementKey2019 } from './types';

export const toJsonWebKey2020 = (
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array
) => {
  const publicKeyJwk = {
    kty: 'OKP',
    crv: 'X25519',
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

export const toX25519KeyAgreementKey2019 = (
  id: string,
  controller: string,
  publicKey: Uint8Array,
  privateKey?: Uint8Array
) => {
  const k: X25519KeyAgreementKey2019 = {
    id: id,
    type: 'X25519KeyAgreementKey2019',
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
  X25519KeyAgreementKey2019: toX25519KeyAgreementKey2019,
};
