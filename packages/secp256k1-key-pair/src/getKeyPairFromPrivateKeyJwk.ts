import { getPublicKeyFromPublicKeyJwk } from './getPublicKeyFromPublicKeyJwk';

export const getKeyPairFromPrivateKeyJwk = (privateKeyJwk: any) => {
  const privateKeyHex = Buffer.from(privateKeyJwk.d, 'base64').toString('hex');
  privateKeyHex.padStart(64, '0');
  return {
    publicKey: getPublicKeyFromPublicKeyJwk(privateKeyJwk),
    privateKey: Uint8Array.from(Buffer.from(privateKeyHex, 'hex')),
  };
};
