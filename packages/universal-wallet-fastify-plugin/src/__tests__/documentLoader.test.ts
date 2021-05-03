import { getFastifyWithWalletOptions, get } from './utils';

import { case0 as vp } from '../__fixtures__/verifiablePresentations';
const supertest = require('supertest');

let fastify: any;
let api: any;

beforeAll(async () => {
  const walletOptions = {
    walletId: 'accountId',
    origin: 'https://platform.example',
    apis: ['verifier'],
    documentLoader: {
      allowNetwork: true,
    },
    get,
  };
  fastify = getFastifyWithWalletOptions(walletOptions);
  await fastify.ready();
  api = supertest(fastify.server);
});

afterAll(() => {
  fastify.close();
});

test('POST `/accounts/123/presentations/verify`', async () => {
  const response = await api
    .post('/accounts/123/presentations/verify')
    .send({
      verifiablePresentation: vp,
      options: {
        checks: ['proof'],
        domain: vp.proof.domain,
        challenge: vp.proof.challenge,
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
