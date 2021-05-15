import { base58, base64url } from './encoding';

export const getMultibaseFingerprintFromPublicKeyBytes = (
  prefix: number,
  publicKey: Uint8Array,
  encoding = 'base58btc'
): string => {
  const buffer = new Uint8Array(2 + publicKey.length);
  // See https://github.com/multiformats/multicodec/blob/master/table.csv
  buffer[0] = prefix;
  buffer[1] = 0x01;
  buffer.set(publicKey, 2);
  if (encoding === 'base58btc') {
    return `z${base58.encode(buffer)}`;
  }
  if (encoding === 'base64url') {
    return `u${base64url.encode(buffer)}`;
  }
  throw new Error('Unsupported encoding: ' + encoding);
};
