import { subtle } from '../crypto';
import { JsonWebKey2020 } from '../types';

const allowedMap: any = {
  'EC P-256': { name: 'ECDSA', namedCurve: 'P-256' },
  'EC P-384': { name: 'ECDSA', namedCurve: 'P-384' },
  'EC P-521': { name: 'ECDSA', namedCurve: 'P-521' },
  'RSASSA-PKCS1-v1_5 2048': {
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 2048,
    hash: 'SHA-256',
    publicExponent: new Uint8Array([1, 0, 1]),
  },
};

export const getJwkFromCryptoKey = async (cryptoKey: CryptoKey) => {
  let jwk = await subtle.exportKey('jwk', cryptoKey);
  delete jwk.ext;
  delete jwk.key_ops;
  return {
    kty: jwk.kty,
    crv: jwk.crv,
    ...jwk,
  };
};

export const getCleanJwksFromCryptoKeyPair = async ({
  publicKey,
  privateKey,
}: {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}) => {
  return {
    publicKeyJwk: await getJwkFromCryptoKey(publicKey),
    privateKeyJwk: await getJwkFromCryptoKey(privateKey),
  };
};

const generateKey = async (
  options: any
): Promise<{ publicKeyJwk: any; privateKeyJwk: any }> => {
  const k: any = await subtle.generateKey(options, true, ['sign', 'verify']);
  return getCleanJwksFromCryptoKeyPair(k);
};

export const generate = async (opts: {
  kty: string;
  crvOrSize: string;
}): Promise<JsonWebKey2020> => {
  try {
    let options = allowedMap[`${opts.kty} ${opts.crvOrSize}`];
    const kp = await generateKey(options);
    return {
      id: '',
      type: 'JsonWebKey2020',
      controller: '',
      ...kp,
    };
  } catch (e) {
    console.warn(e);
    throw new Error(`Unsupport generate options: ${JSON.stringify(opts)}`);
  }
};
