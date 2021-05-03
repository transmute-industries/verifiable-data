import { getFastifyWithWalletOptions, walletOptions } from './utils';
import { case1 as vc } from '../__fixtures__/verifiableCredentials';
const supertest = require('supertest');

let api: any;
let fastify: any;

beforeAll(async () => {
  fastify = getFastifyWithWalletOptions(walletOptions);
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
      verifiableCredential: vc,
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
