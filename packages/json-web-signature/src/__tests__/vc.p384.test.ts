import { JsonWebKey, JsonWebSignature } from '../index';

import { ld as vcjs } from '@transmute/vc.js';
import { documentLoader, didDocument } from '../__fixtures__';
let suite: JsonWebSignature;

it('can sign and verify', async () => {
  const key = await JsonWebKey.from({
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

  const vc = await vcjs.createVerifiableCredential({
    credential: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
      ],
      id: 'https://example.com/credentials/123',
      issuer: key.controller,
      issuanceDate: '2010-01-01T19:23:24Z',
      type: ['VerifiableCredential'],
      credentialSubject: {
        id: `https://example.com/example/123`,
      },
    },
    suite,
    documentLoader,
  });

  // console.log(JSON.stringify(vc, null, 2));
  const verification = await vcjs.verifyVerifiableCredential({
    credential: vc,
    suite,
    documentLoader: async (iri: string) => {
      if (iri.startsWith(key.controller)) {
        return {
          documentUrl: iri,
          document: didDocument,
        };
      }
      return documentLoader(iri);
    },
  });

  // console.log(JSON.stringify(verification, null, 2));
  expect(verification.verified).toBe(true);
});
