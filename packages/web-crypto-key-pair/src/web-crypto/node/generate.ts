let subtle =
  typeof window !== 'undefined' && typeof jest === 'undefined'
    ? window.crypto.subtle
    : require('crypto').webcrypto.subtle;

const generateKey = async (options: any) => {
  const k = await subtle.generateKey(options, true, ['sign', 'verify']);
  let kp = {
    publicKeyJwk: await subtle.exportKey('jwk', k.publicKey),
    privateKeyJwk: await subtle.exportKey('jwk', k.privateKey),
  };
  delete kp.privateKeyJwk.ext;
  delete kp.privateKeyJwk.key_ops;

  delete kp.publicKeyJwk.ext;
  delete kp.publicKeyJwk.key_ops;

  kp = {
    publicKeyJwk: {
      kty: kp.publicKeyJwk.kty,
      crv: kp.publicKeyJwk.crv,
      ...kp.publicKeyJwk,
    },
    privateKeyJwk: {
      kty: kp.privateKeyJwk.kty,
      crv: kp.privateKeyJwk.crv,
      ...kp.privateKeyJwk,
    },
  };
  return kp;
};

let allowedMap: any = {
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

export const generate = async (opts: { kty: string; crvOrSize: string }) => {
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
