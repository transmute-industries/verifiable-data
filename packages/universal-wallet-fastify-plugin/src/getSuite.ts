import {
  BbsBlsSignature2020,
  //   BbsBlsSignatureProof2020,
} from '@mattrglobal/jsonld-signatures-bbs';

import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';

import * as ed25519 from '@transmute/did-key-ed25519';
import * as bls12381 from '@transmute/did-key-bls12381';

const getSuite = async (k: any) => {
  if (k.publicKeyJwk) {
    if (k.publicKeyJwk.kty == 'OKP' && k.publicKeyJwk.crv == 'Ed25519') {
      return new Ed25519Signature2018({
        key: await ed25519.Ed25519KeyPair.from(k),
      });
    }
    if (k.publicKeyJwk.kty == 'EC' && k.publicKeyJwk.crv == 'BLS12381_G2') {
      return new BbsBlsSignature2020({
        key: (await bls12381.Bls12381G2KeyPair.from(k)) as any,
      });
    }
  }
  throw new Error('Unsupported key ' + k.id);
};

const getSuiteMap = () => {
  return {
    Ed25519Signature2018,
    BbsBlsSignature2020,
  };
};

export { getSuite, getSuiteMap };
