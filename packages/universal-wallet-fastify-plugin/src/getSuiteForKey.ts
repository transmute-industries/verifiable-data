import { BbsBlsSignature2020 } from '@mattrglobal/jsonld-signatures-bbs';
import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018,
} from '@transmute/ed25519-signature-2018';

import * as bls12381 from '@transmute/did-key-bls12381';

export const getSuiteForKey = async (k: any) => {
  if (
    k.publicKeyJwk &&
    k.publicKeyJwk.kty === 'EC' &&
    k.publicKeyJwk.crv === 'BLS12381_G2'
  ) {
    const key: any = await bls12381.Bls12381G2KeyPair.from(k);
    const suite = new BbsBlsSignature2020({
      key,
    });
    return suite;
  }

  if (
    k.publicKeyJwk &&
    k.publicKeyJwk.kty === 'OKP' &&
    k.publicKeyJwk.crv === 'Ed25519'
  ) {
    const key = await Ed25519VerificationKey2018.from(k);
    const suite = new Ed25519Signature2018({
      key,
    });
    return suite;
  }
  throw new Error('Unsupported key ' + k.id);
};
