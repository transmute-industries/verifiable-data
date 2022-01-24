import * as _ from 'lodash';

import { getFastifyWithWalletOptions, walletOptions } from './utils';

import { case0 as vc } from '../__fixtures__/verifiableCredentials';
import { case0 as vp } from '../__fixtures__/verifiablePresentations';
const supertest = require('supertest');

let api: any;
let fastify: any;

console.error = () => {};
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

test('POST `/accounts/123/credentials/verify` with missing required field', async () => {
  const vc2: any = _.cloneDeep(vc);
  delete vc2.proof.created;
  await api
    .post('/accounts/123/credentials/verify')
    .send({
      verifiableCredential: vc2,
      options: {
        checks: ['proof'],
      },
    })
    .expect(400);
});

test('should 400 with additional field not in context', async () => {
  const vc2: any = _.cloneDeep(vc);
  vc2.newProp = 'foo';
  await api
    .post('/accounts/123/credentials/verify')
    .send({
      verifiableCredential: vc2,
      options: {
        checks: ['proof'],
      },
    })
    .expect(400);
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
