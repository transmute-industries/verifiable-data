export const keyPairToAlg = (publicKeyJwk: any) => {
  if (publicKeyJwk.kty === 'EC' && publicKeyJwk.crv === 'P-256') {
    return 'ES256';
  }
  throw new Error(
    'Unsupported key type' + JSON.stringify(publicKeyJwk, null, 2)
  );
};
