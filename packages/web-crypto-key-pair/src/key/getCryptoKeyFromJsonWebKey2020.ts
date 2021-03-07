import { subtle } from '../crypto';
import { JsonWebKey2020 } from '../types';

const getImportKeyOptsFromJwk = (jwk: any, derive = false) => {
  if (jwk.kty === 'EC' && jwk.crv === 'P-256') {
    return {
      name: derive ? 'ECDH' : 'ECDSA',
      namedCurve: 'P-256',
    };
  }

  if (jwk.kty === 'EC' && jwk.crv === 'P-384') {
    return {
      name: derive ? 'ECDH' : 'ECDSA',
      namedCurve: 'P-384',
    };
  }

  if (jwk.kty === 'EC' && jwk.crv === 'P-521') {
    return {
      name: derive ? 'ECDH' : 'ECDSA',
      namedCurve: 'P-521',
    };
  }

  if (jwk.kty === 'RSA') {
    return derive
      ? {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          hash: 'SHA-256',
          publicExponent: new Uint8Array([1, 0, 1]),
        }
      : {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          hash: 'SHA-256',
          publicExponent: new Uint8Array([1, 0, 1]),
        };
  }

  throw new Error('Unsupported jwk: ' + JSON.stringify(jwk));
};

export const getCryptoKeyFromJsonWebKey2020 = async (
  keypair: JsonWebKey2020 | { publicKeyJwk: any; privateKeyJwk?: any },
  derive = false
) => {
  if (!keypair.privateKeyJwk) {
    return subtle.importKey(
      'jwk',
      keypair.publicKeyJwk,
      getImportKeyOptsFromJwk(keypair.publicKeyJwk, derive),
      true,
      derive ? [] : ['verify']
    );
  }
  if (keypair.privateKeyJwk) {
    return subtle.importKey(
      'jwk',
      keypair.privateKeyJwk,
      getImportKeyOptsFromJwk(keypair.privateKeyJwk, derive),
      true,
      derive ? ['deriveBits'] : ['sign']
    );
  }
  throw new Error('unsupported key type:  ' + JSON.stringify(keypair));
};
