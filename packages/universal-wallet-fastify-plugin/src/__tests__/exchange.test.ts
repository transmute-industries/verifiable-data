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

test('POST `/accounts/123/presentations/available`', async () => {
  const response = await api
    .post('/accounts/123/presentations/available')
    .send({
      credential: {},
      options: {
        proofPurpose: 'assertionMethod',
        verificationMethod: 'did:web:platform.example:accounts:123#key-0',
      },
    });
  expect(response.status).toBe(200);
});
