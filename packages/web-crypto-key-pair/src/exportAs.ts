import { base58 } from './encoding';
import * as key from './key';
import { JsonWebKey2020, P384Key2021, P256Key2021, P521Key2021 } from './types';
import { compress } from './compression/ec-compression';

export const toJsonWebKey2020 = async (
  id: string,
  controller: string,
  publicKey: CryptoKey,
  privateKey?: CryptoKey
) => {
  const kp: JsonWebKey2020 = {
    id: id,
    type: 'JsonWebKey2020',
    controller: controller,
    publicKeyJwk: await key.getJwkFromCryptoKey(publicKey),
  };
  if (privateKey) {
    try {
      kp.privateKeyJwk = await key.getJwkFromCryptoKey(privateKey);
    } catch (e) {
      throw new Error('Cannot export private key');
    }
  }
  return kp;
};

const conventionExportHelper = async (
  id: string,
  type: string,
  controller: string,
  publicKey: any,
  privateKey?: any
) => {
  const publicKeyJwk: any = await key.getJwkFromCryptoKey(publicKey);
  const privateKeyJwk: any = privateKey
    ? await key.getJwkFromCryptoKey(privateKey)
    : undefined;
  const kp: any = {
    id,
    type,
    controller: controller,
    publicKeyBase58: base58.encode(
      compress(
        Buffer.concat([
          Buffer.from(publicKeyJwk.x, 'base64'),
          Buffer.from(publicKeyJwk.y, 'base64'),
        ])
      )
    ),
  };
  if (privateKeyJwk) {
    kp.privateKeyBase58 = base58.encode(Buffer.from(privateKeyJwk.d, 'base64'));
  }
  return kp;
};

export const toP521Key2021 = async (
  id: string,
  controller: string,
  publicKey: CryptoKey,
  privateKey?: CryptoKey
) => {
  return conventionExportHelper(
    id,
    'P521Key2021',
    controller,
    publicKey,
    privateKey
  ) as Promise<P521Key2021>;
};

export const toP384Key2021 = async (
  id: string,
  controller: string,
  publicKey: CryptoKey,
  privateKey?: CryptoKey
) => {
  return conventionExportHelper(
    id,
    'P384Key2021',
    controller,
    publicKey,
    privateKey
  ) as Promise<P384Key2021>;
};

export const toP256Key2021 = async (
  id: string,
  controller: string,
  publicKey: CryptoKey,
  privateKey?: CryptoKey
) => {
  return conventionExportHelper(
    id,
    'P256Key2021',
    controller,
    publicKey,
    privateKey
  ) as Promise<P256Key2021>;
};

export const exportableTypes = {
  JsonWebKey2020: toJsonWebKey2020,
  P521Key2021: toP521Key2021,
  P384Key2021: toP384Key2021,
  P256Key2021: toP256Key2021,
};
