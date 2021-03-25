import {
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
} from '@mattrglobal/jsonld-signatures-bbs';

import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';

export const getSuiteMap = () => {
  return {
    Ed25519Signature2018,
    BbsBlsSignature2020,
    BbsBlsSignatureProof2020,
  };
};
