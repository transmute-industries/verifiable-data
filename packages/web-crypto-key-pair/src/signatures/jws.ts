import { base64url } from '../encoding';
// beware of ordering.
const canonicalize = JSON.stringify;
import {
  JwsSigner,
  JwsSignerOptions,
  DetachedJwsSignerOptions,
  DetachedJwsSigner,
  JwsVerifier,
  JwsVerifierOptions,
  DetachedJwsVerifier,
  DetachedJwsVerifierOptions,
} from '../types';

import { getSignaturOptionsFromCryptoKey } from './getSignaturOptionsFromCryptoKey';

import { getSigner as getRawSigner } from './getSigner';
import { getVerifier as getRawVerifier } from './getVerifier';

export const getJwaAlgFromJwk = (jwk: any) => {
  if (jwk.kty === 'EC' && jwk.crv === 'P-256') {
    return 'ES256';
  }
  if (jwk.kty === 'EC' && jwk.crv === 'P-384') {
    return 'ES384';
  }
  if (jwk.kty === 'EC' && jwk.crv === 'P-521') {
    return 'ES512';
  }
  if (jwk.kty === 'RSA') {
    return 'RS256';
  }
  throw new Error('Unsupported jwk ' + JSON.stringify(jwk));
};

export const createJws = async (signer: any, payload: any, header: object) => {
  const encodedHeader = base64url.encode(canonicalize(header));
  const encodedPayload = base64url.encode(
    typeof payload === 'string' ? payload : canonicalize(payload)
  );
  const toBeSigned = `${encodedHeader}.${encodedPayload}`;
  const signature = await signer.sign({ data: toBeSigned });
  return `${toBeSigned}.${base64url.encode(Buffer.from(signature))}`;
};

export const verifyJws = async (verifier: any, jws: string) => {
  const [header, payload, signature] = jws.split('.');
  const toBeVerified = `${header}.${payload}`;
  const verified = await verifier.verify({
    data: Buffer.from(toBeVerified),
    signature: Buffer.from(signature, 'base64'),
  });

  return verified;
};

export const createDetachedJws = async (
  signer: any,
  payload: Uint8Array,
  header: object
) => {
  const encodedHeader = base64url.encode(
    canonicalize({ ...header, b64: false, crit: ['b64'] })
  );

  const toBeSigned = new Uint8Array(
    Buffer.concat([
      Buffer.from(encodedHeader, 'utf-8'),
      Buffer.from('.', 'utf-8'),
      payload,
    ])
  );
  const signature = await signer.sign({ data: toBeSigned });
  const encodedSignature = base64url.encode(Buffer.from(signature));
  return `${encodedHeader}..${encodedSignature}`;
};

export const verifyDetachedJws = async (
  verifier: any,
  payload: Uint8Array,
  signature: string
) => {
  const [encodedHeader, encodedSignature] = signature.split('..');

  const toBeVerified = new Uint8Array(
    Buffer.concat([
      Buffer.from(encodedHeader, 'utf-8'),
      Buffer.from('.', 'utf-8'),
      payload,
    ])
  );

  const verified = await verifier.verify({
    data: toBeVerified,
    signature: Buffer.from(encodedSignature, 'base64'),
  });

  return verified;
};

const getAlg = async (cryptoKey: CryptoKey) => {
  const rawSignatureOptions: any = getSignaturOptionsFromCryptoKey(cryptoKey);

  let alg = 'none';

  if (rawSignatureOptions === 'RSASSA-PKCS1-v1_5') {
    alg = 'RS256';
  }

  if (
    rawSignatureOptions.name === 'ECDSA' &&
    rawSignatureOptions.hash === 'SHA-256'
  ) {
    alg = 'ES256';
  }

  if (
    rawSignatureOptions.name === 'ECDSA' &&
    rawSignatureOptions.hash === 'SHA-384'
  ) {
    alg = 'ES384';
  }

  if (
    rawSignatureOptions.name === 'ECDSA' &&
    rawSignatureOptions.hash === 'SHA-512'
  ) {
    alg = 'ES512';
  }

  if (alg === 'none') {
    throw new Error(`Unsupported signature alg: ${alg}`);
  } else {
    return alg;
  }
};

export const getJwsSigner = async (
  cryptoKey: CryptoKey
): Promise<JwsSigner> => {
  const signer = await getRawSigner(cryptoKey);
  const alg = await getAlg(cryptoKey);
  return {
    sign: async ({ data }: JwsSignerOptions) => {
      return createJws(signer, data, { alg });
    },
  };
};

export const getDetachedJwsSigner = async (
  cryptoKey: CryptoKey
): Promise<DetachedJwsSigner> => {
  const signer = await getRawSigner(cryptoKey);
  const alg = await getAlg(cryptoKey);
  return {
    sign: async ({ data }: DetachedJwsSignerOptions) => {
      return createDetachedJws(signer, data, { alg });
    },
  };
};

export const getJwsVerifier = async (
  cryptoKey: CryptoKey
): Promise<JwsVerifier> => {
  const verifier = await getRawVerifier(cryptoKey);
  return {
    verify: async ({ signature }: JwsVerifierOptions) => {
      return verifyJws(verifier, signature);
    },
  };
};

export const getDetachedJwsVerifier = async (
  cryptoKey: CryptoKey
): Promise<DetachedJwsVerifier> => {
  const verifier = await getRawVerifier(cryptoKey);
  return {
    verify: async ({ data, signature }: DetachedJwsVerifierOptions) => {
      return verifyDetachedJws(verifier, data, signature);
    },
  };
};
