import { fastify } from './utils';
const supertest = require('supertest');

import { case0 } from '../__fixtures__/verifiableCredentials';

let api: any;

beforeAll(async () => {
  await fastify.ready();
  api = supertest(fastify.server);
});

afterAll(() => {
  fastify.close();
});

test('POST `/accounts/123/presentations/prove`', async () => {
  const response = await api
    .post('/accounts/123/presentations/prove')
    .send({
      presentation: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://www.w3.org/2018/credentials/examples/v1',
        ],
        holder: 'did:web:platform.example:accounts:123',
        type: 'VerifiablePresentation',
        verifiableCredential: [case0],
      },
      options: {
        verificationMethod: 'did:web:platform.example:accounts:123#key-0',
        proofPurpose: 'assertionMethod',
        domain: 'example.com',
        challenge: 'd436f0c8-fbd9-4e48-bbb2-55fc5d0920a8',
      },
    })
    .expect(201)
    .expect('Content-Type', 'application/json; charset=utf-8');
  expect(response.body.type.includes('VerifiablePresentation')).toBe(true);
  expect(response.body.proof.type).toBe('Ed25519Signature2018');
});
