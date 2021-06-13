export const getSignatureOptionsFromCryptoKey = (cryptoKey: CryptoKey) => {
  if (
    (cryptoKey as any).algorithm.name === 'ECDSA' &&
    (cryptoKey as any).algorithm.namedCurve === 'P-256'
  ) {
    return { name: 'ECDSA', hash: 'SHA-256' };
  }
  if (
    (cryptoKey as any).algorithm.name === 'ECDSA' &&
    (cryptoKey as any).algorithm.namedCurve === 'P-384'
  ) {
    return { name: 'ECDSA', hash: 'SHA-384' };
  }

  if (
    (cryptoKey as any).algorithm.name === 'ECDSA' &&
    (cryptoKey as any).algorithm.namedCurve === 'P-521'
  ) {
    return { name: 'ECDSA', hash: 'SHA-512' };
  }

  if ((cryptoKey as any).algorithm.name === 'RSASSA-PKCS1-v1_5') {
    return 'RSASSA-PKCS1-v1_5';
  }

  throw new Error('Unsupported cryptoKey: ' + JSON.stringify(cryptoKey));
};
