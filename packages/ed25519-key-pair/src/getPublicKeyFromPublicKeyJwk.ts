export const getPublicKeyFromPublicKeyJwk = (publicKeyJwk: any) => {
  return Uint8Array.from(Buffer.from(publicKeyJwk.x, 'base64'));
};
