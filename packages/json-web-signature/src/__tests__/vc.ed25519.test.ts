import { JsonWebKey, JsonWebSignature } from '../index';
import { ld as vcjs } from '@transmute/vc.js';
import { documentLoader } from '../__fixtures__';
let suite: JsonWebSignature;

it('can sign and verify', async () => {
  const key = await JsonWebKey.from({
    id: 'did:example:123#key',
    type: 'Ed25519VerificationKey2018',
    controller: 'did:example:123',
    publicKeyBase58: 'HGV154Ra7BvkeHvWJNNo8ny6BCKUnSyRA5Zo4nga4DnF',
    privateKeyBase58:
      '4CXXY2kg9Qfb12XZcBLghyZEgvFumU2WEFrSeEooYb7VKbUiNTfyrcJg5JPvKf8oYkh7QXV6t6ZeoZRkfTKkJSXq',
  });
  suite = new JsonWebSignature({
    key,
  });
  expect(suite.verificationMethod).toBe('did:example:123#key');

  const didDoc = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2018/v1',
    ],
    id: 'did:example:123',
    verificationMethod: [
      {
        id: 'did:example:123#key',
        type: 'Ed25519VerificationKey2018',
        controller: 'did:example:123',
        publicKeyBase58: 'HGV154Ra7BvkeHvWJNNo8ny6BCKUnSyRA5Zo4nga4DnF',
      },
    ],
    authentication: ['did:example:123#key'],
    assertionMethod: ['did:example:123#key'],
  };

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

  const vp = await vcjs.createVerifiablePresentation({
    presentation: {
      '@context': vc['@context'],
      type: ['VerifiablePresentation'],
      holder: key.controller,
      verifiableCredential: [vc],
    },
    challenge: '123',
    suite,
    documentLoader: documentLoader as any,
  });

  const verification = await vcjs.verifyVerifiablePresentation({
    presentation: vp,
    suite,
    challenge: '123',
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
