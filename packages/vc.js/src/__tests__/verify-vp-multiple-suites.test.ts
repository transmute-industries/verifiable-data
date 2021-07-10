import * as vcjs from '../index';
import * as ed25519 from '@transmute/did-key-ed25519';
import * as bls12381 from '@transmute/did-key-bls12381';
import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';
import {
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
} from '@mattrglobal/jsonld-signatures-bbs';

const vp = require('../__interop__/verifiablePresentations/case-0.json');

const contexts: any = {
  'https://www.w3.org/2018/credentials/v1': require('../__fixtures__/contexts/credentials-v1.json'),
  'https://w3id.org/citizenship/v1': require('../__fixtures__/contexts/citizenship-v1.json'),
  'https://w3id.org/bbs/v1': require('../__fixtures__/contexts/bbs-v1.json'),
  'https://w3id.org/security/v2': require('../__fixtures__/contexts/security-v2.json'),
  'https://w3id.org/security/v1': require('../__fixtures__/contexts/security-v1.json'),
  'https://www.w3.org/ns/did/v1': require('../__fixtures__/contexts/did-v1.json'),
};

it('can verify a vp that uses multiple suites', async () => {
  const verification = await vcjs.ld.verify({
    presentation: vp,
    domain: vp.proof.domain,
    challenge: vp.proof.challenge,
    suiteMap: {
      Ed25519Signature2018: Ed25519Signature2018,
      BbsBlsSignature2020: BbsBlsSignature2020,
      BbsBlsSignatureProof2020: BbsBlsSignatureProof2020,
    },
    documentLoader: async (iri: string) => {
      if (contexts[iri]) {
        return {
          documentUrl: iri,
          document: contexts[iri],
        };
      }
      if (iri.startsWith('did:key:z6M')) {
        const { didDocument } = await ed25519.driver.resolve(iri, {
          accept: 'application/did+ld+json',
        });
        return {
          documentUrl: iri,
          document: didDocument,
        };
      }

      if (iri.startsWith('did:key:z5T')) {
        const { didDocument } = await bls12381.driver.resolve(iri, {
          accept: 'application/did+ld+json',
        });
        return {
          documentUrl: iri,
          document: didDocument,
        };
      }
      console.error(iri);
      throw new Error('unsupported iri ' + iri);
    },
  });

  expect(verification.verified).toBe(true);
});
