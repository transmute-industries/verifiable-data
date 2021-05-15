import { base58, base64url } from './encoding';

import {
  SECP256K1_MULTICODEC_IDENTIFIER,
  VARIABLE_INTEGER_TRAILING_BYTE,
} from './constants';
export const getMultibaseFingerprintFromPublicKeyBytes = (
  publicKey: Uint8Array,
  encoding = 'base58btc'
): string => {
  const buffer = new Uint8Array(2 + publicKey.length);
  buffer[0] = SECP256K1_MULTICODEC_IDENTIFIER;
  buffer[1] = VARIABLE_INTEGER_TRAILING_BYTE;
  buffer.set(publicKey, 2);
  if (encoding === 'base58btc') {
    return `z${base58.encode(buffer)}`;
  }
  if (encoding === 'base64url') {
    return `u${base64url.encode(buffer)}`;
  }
  throw new Error('Unsupported encoding: ' + encoding);
};
