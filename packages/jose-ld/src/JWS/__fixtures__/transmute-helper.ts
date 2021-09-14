import { Secp256k1KeyPair } from '@transmute/secp256k1-key-pair';

import { createSigner } from '../createSigner';

import { createVerifier } from '../createVerifier';

const getSigner = async (privateKeyJwk: any) => {
  let k: Secp256k1KeyPair;
  k = await Secp256k1KeyPair.from({
    type: 'JsonWebKey2020',
    publicKeyJwk: privateKeyJwk,
    privateKeyJwk,
  } as any);
  return k.signer();
};

const getVerifier = async (publicKeyJwk: any) => {
  let k: Secp256k1KeyPair;
  k = await Secp256k1KeyPair.from({
    type: 'JsonWebKey2020',
    publicKeyJwk,
  } as any);
  return k.verifier();
};

export const sign = async (header: any, payload: any, privateKeyJwk: any) => {
  const signer = await getSigner(privateKeyJwk);
  const jwsSigner = await createSigner(signer, 'ES256K', {
    detached: false,
    header,
  });
  return jwsSigner.sign({ data: payload });
};

export const verify = async (jws: string, publicKeyJwk: any) => {
  const verifier = await getVerifier(publicKeyJwk);
  const jwsVerifier = await createVerifier(verifier, 'ES256K', {
    detached: false,
  });
  return jwsVerifier.verify({ signature: jws });
};
