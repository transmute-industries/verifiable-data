import * as api from './index';

it('can prove presentation with the vc api', async () => {
  const vp = await api.prove({
    endpoint: 'https://api.did.actor/api/presentations/prove',
    presentation: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [
        {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'urn:uuid:07aa969e-b40d-4c1b-ab46-ded252003ded',
          type: ['VerifiableCredential'],
          issuer: 'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
          issuanceDate: '2010-01-01T19:23:24Z',
          credentialSubject:
            'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
          proof: {
            type: 'Ed25519Signature2018',
            created: '2021-10-30T19:16:30Z',
            verificationMethod:
              'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
            proofPurpose: 'assertionMethod',
            jws:
              'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..puetBYS3pkYlYzAecBiT-WkigYAlVbslrz9wPFnk9JW4AwjrpJvcsSdZJPhZtNy_myMJUNzC_QaYyw3ni1V0BA',
          },
        },
      ],
    },
    options: {
      type: 'Ed25519Signature2018',
      domain: 'jobs.example',
      challenge: '1f44d55f-f161-4938-a659-f8026467f126',
    },
  });
  expect(vp.proof.type).toBe('Ed25519Signature2018');
});

it('can verify a verifiable presentation with the vc api', async () => {
  const result = await api.verify({
    endpoint: 'https://api.did.actor/api/presentations/verify',
    verifiablePresentation: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [
        {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'urn:uuid:07aa969e-b40d-4c1b-ab46-ded252003ded',
          type: ['VerifiableCredential'],
          issuer: 'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
          issuanceDate: '2010-01-01T19:23:24Z',
          credentialSubject:
            'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
          proof: {
            type: 'Ed25519Signature2018',
            created: '2021-10-30T19:16:30Z',
            verificationMethod:
              'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
            proofPurpose: 'assertionMethod',
            jws:
              'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..puetBYS3pkYlYzAecBiT-WkigYAlVbslrz9wPFnk9JW4AwjrpJvcsSdZJPhZtNy_myMJUNzC_QaYyw3ni1V0BA',
          },
        },
      ],
      holder: 'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
      proof: {
        type: 'Ed25519Signature2018',
        created: '2022-03-05T17:48:52Z',
        verificationMethod:
          'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
        proofPurpose: 'authentication',
        challenge: '1f44d55f-f161-4938-a659-f8026467f126',
        domain: 'jobs.example',
        jws:
          'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Sy35PrzfaZj5m3DDzGckxZgtxh57WWOBTG4NXKVS7R4bDnp_2Kf83AtvlGEbrbwB9K_tk9aGpbfCelqt71qaCw',
      },
    },
    options: {
      challenge: '1f44d55f-f161-4938-a659-f8026467f126',
      domain: 'jobs.example',
    },
  });
  expect(result.verified).toBe(true);
});
