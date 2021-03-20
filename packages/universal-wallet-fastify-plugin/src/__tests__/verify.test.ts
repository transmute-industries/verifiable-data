import { fastify } from './utils';
const supertest = require('supertest');

let api: any;

beforeAll(async () => {
  await fastify.ready();
  api = supertest(fastify.server);
});

afterAll(() => {
  fastify.close();
});

test('POST `/accounts/123/credentials/verify`', async () => {
  const response = await api
    .post('/accounts/123/credentials/verify')
    .send({
      verifiableCredential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: 'http://example.gov/credentials/3732',
        type: ['VerifiableCredential'],
        issuer: { id: 'did:web:platform.example:accounts:123' },
        issuanceDate: '2010-03-10T04:24:12.164Z',
        credentialSubject: { id: 'did:web:platform.example:accounts:123' },
        proof: {
          type: 'Ed25519Signature2018',
          created: '2021-03-20T18:47:52.211Z',
          jws:
            'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..atTk4PTI3BAoctCe9avOk38w6MBmiIt3Za6vXINEi2YHxoeVC4Eqm0Xf9hzG1xKPAt5vRkApnuTJd-1Qt3HkCg',
          proofPurpose: 'assertionMethod',
          verificationMethod: 'did:web:platform.example:accounts:123#key-0',
        },
      },
      options: {
        checks: ['proof'],
      },
    })
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');

  expect(response.body).toEqual({
    checks: ['proof'],
    warnings: [],
    errors: [],
  });
});
