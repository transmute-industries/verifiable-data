import * as api from './index';

it('can issue with the vc api', async () => {
  const vc = await api.issue({
    endpoint: 'https://api.did.actor/api/credentials/issue',
    credential: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'urn:uuid:07aa969e-b40d-4c1b-ab46-ded252003ded',
      type: ['VerifiableCredential'],
      issuanceDate: '2010-01-01T19:23:24Z',
      credentialSubject: {
        id: 'did:example:123',
      },
    },
    options: { type: 'Ed25519Signature2018' },
  });
  expect(vc.proof.type).toBe('Ed25519Signature2018');
});

it('can verify with the vc api', async () => {
  const result = await api.verify({
    endpoint: 'https://api.did.actor/api/credentials/verify',
    verifiableCredential: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'urn:uuid:07aa969e-b40d-4c1b-ab46-ded252003ded',
      type: ['VerifiableCredential'],
      issuanceDate: '2010-01-01T19:23:24Z',
      credentialSubject: { id: 'did:example:123' },
      issuer: 'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
      proof: {
        type: 'Ed25519Signature2018',
        created: '2022-03-05T17:23:03Z',
        verificationMethod:
          'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
        proofPurpose: 'assertionMethod',
        jws:
          'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..psKtj5yzmE_3NfxNN1kEDfQ1iAwEI1JFpOgR7deeL1OuuDBGp28-zQDMZ49sbKnJLW7VEjqhwNw1wexNaJIuDg',
      },
    },
  });
  expect(result.verified).toBe(true);
});
