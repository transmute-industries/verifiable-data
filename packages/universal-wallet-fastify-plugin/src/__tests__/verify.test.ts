import { fastify } from './utils';
const supertest = require('supertest');

import { case0 as vc } from '../__fixtures__/verifiableCredentials';
import { case0 as vp } from '../__fixtures__/verifiablePresentations';

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
