import { base58, base64url } from './encoding';

import {
  BLS12381G1ANDG2_MULTICODEC_IDENTIFIER,
  BLS12381G1_MULTICODEC_IDENTIFIER,
  BLS12381G2_MULTICODEC_IDENTIFIER,
  VARIABLE_INTEGER_TRAILING_BYTE,
} from './constants';

import { BlsCurveName } from './types';

const curveMap: any = {
  Bls12381G1Key2020: BlsCurveName.G1,
  Bls12381G2Key2020: BlsCurveName.G2,
};

const _toJsonWebKeyPair = (keypair: any) => {
  const jsonWebKeyPair: any = {
    id: keypair.id,
    controller: keypair.controller,
    type: 'JsonWebKey2020',
    publicKeyJwk: {
      kty: 'EC',
      crv: curveMap[keypair.type],
      x: base64url.encode(base58.decode(keypair.publicKeyBase58)),
    },
  };

  if (keypair.privateKeyBase58) {
    jsonWebKeyPair.privateKeyJwk = {
      kty: 'EC',
      crv: curveMap[keypair.type],
      x: base64url.encode(base58.decode(keypair.publicKeyBase58)),
      d: base64url.encode(base58.decode(keypair.privateKeyBase58)),
    };
  }

  return jsonWebKeyPair;
};

export const fingerprintToJsonWebKey2020 = (fingerprint: string) => {
  if (fingerprint[0] !== 'z') {
    throw new Error('base58 encoded fingerprint must start with "z"');
  }

  const buffer = base58.decode(fingerprint.substring(1));

  if (
    buffer[0] === BLS12381G1_MULTICODEC_IDENTIFIER &&
    buffer[1] === VARIABLE_INTEGER_TRAILING_BYTE
  ) {
    let kp = _toJsonWebKeyPair({
      type: 'Bls12381G1Key2020',
      publicKeyBase58: base58.encode(buffer.slice(2)),
    });
    return {
      bls12381G1KeyPair: {
        ...kp,
        id: `did:key:${fingerprint}#${fingerprint}`,
        controller: `did:key:${fingerprint}`,
      },
    };
  }

  if (
    buffer[0] === BLS12381G2_MULTICODEC_IDENTIFIER &&
    buffer[1] === VARIABLE_INTEGER_TRAILING_BYTE
  ) {
    let kp = _toJsonWebKeyPair({
      type: 'Bls12381G2Key2020',
      publicKeyBase58: base58.encode(buffer.slice(2)),
    });
    return {
      bls12381G2KeyPair: {
        ...kp,
        id: `did:key:${fingerprint}#${fingerprint}`,
        controller: `did:key:${fingerprint}`,
      },
    };
  }

  if (
    buffer[0] === BLS12381G1ANDG2_MULTICODEC_IDENTIFIER &&
    buffer[1] === VARIABLE_INTEGER_TRAILING_BYTE
  ) {
    let g1 = _toJsonWebKeyPair({
      type: 'Bls12381G1Key2020',
      publicKeyBase58: base58.encode(buffer.slice(2, 50)),
    });
    let g2 = _toJsonWebKeyPair({
      type: 'Bls12381G2Key2020',
      publicKeyBase58: base58.encode(buffer.slice(50)),
    });
    return {
      bls12381G1KeyPair: {
        ...g1,
        id: `did:key:${fingerprint}#${fingerprint}`,
        controller: `did:key:${fingerprint}`,
      },
      bls12381G2KeyPair: {
        ...g2,
        id: `did:key:${fingerprint}#${fingerprint}`,
        controller: `did:key:${fingerprint}`,
      },
    };
  }

  throw new Error('unsupported fingerprint is not g1, g2 or g1 and g2.');
};
