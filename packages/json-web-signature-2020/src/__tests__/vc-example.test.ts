import { KeyPair, JsonWebSignature, SUITE_CONTEXT_IRI } from '../index';

import { ld as vcjs } from '@transmute/vc.js';
import { documentLoader } from '../__fixtures__';
let suite: JsonWebSignature;

it('can sign and verify', async () => {
  const key = await KeyPair.from({
    id: 'did:example:123#key',
    type: 'JsonWebKey2020',
    controller: 'did:example:123',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
      y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
      y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
      d: 'Wq5_KgqjvYh_EGvBDYtSs_0ufJJP0y0tkAXl6GqxHMkY0QP8vmD76mniXD-BWhd_',
    },
  });
  suite = new JsonWebSignature({
    key,
  });
  expect(suite.verificationMethod).toBe('did:example:123#key');

  const vc = await vcjs.issue({
    credential: {
      '@context': ['https://www.w3.org/2018/credentials/v1', SUITE_CONTEXT_IRI],
      id: 'https://example.com/credentials/123',
      issuer: key.controller,
      issuanceDate: '2000-03-10T04:24:12.164Z',
      type: ['VerifiableCredential'],
      credentialSubject: {
        id: `https://example.com/example/123`,
      },
    },
    suite,
    documentLoader,
  });

  const didDoc = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
    ],
    id: 'did:example:123',
    assertionMethod: [
      {
        id: 'did:example:123#key',
        type: 'JsonWebKey2020',
        controller: 'did:example:123',
        publicKeyJwk: {
          kty: 'EC',
          crv: 'P-384',
          x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
          y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
        },
      },
    ],
  };

  const verification = await vcjs.verifyCredential({
    credential: vc,
    suite,
    documentLoader: async (iri: string) => {
      if (iri.startsWith(key.controller)) {
        return {
          documentUrl: iri,
          document: didDoc,
        };
      }
      return documentLoader(iri);
    },
  });

  expect(verification.verified).toBe(true);
});
