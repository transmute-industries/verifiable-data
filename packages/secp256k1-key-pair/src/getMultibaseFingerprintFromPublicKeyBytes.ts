import { base58, base64url } from './encoding';

export const getMultibaseFingerprintFromPublicKeyBytes = (
  publicKey: Uint8Array,
  encoding = 'base58btc'
): string => {
  const buffer = new Uint8Array(2 + publicKey.length);
  // See https://github.com/multiformats/multicodec/blob/master/table.csv
  // 0xe7 is Secp256k1 public key
  buffer[0] = 0xe7; //
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
