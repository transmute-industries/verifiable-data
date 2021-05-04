import { getFastifyWithWalletOptions, walletOptions } from './utils';

import { case0 } from '../__fixtures__/verifiableCredentials';

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

test('POST `/accounts/123/wallet/add`', async () => {
  const response = await api.post('/accounts/123/wallet/add').send({
    content: case0,
  });
  expect(response.status).toBe(200);
  expect(response.body).toEqual({});
  expect((await fastify.wallet.get('123')).contents[2]).toEqual(case0);
});

test('POST `/accounts/123/wallet/remove`', async () => {
  expect((await fastify.wallet.get('123')).contents.length).toBe(3);
  const response = await api.post('/accounts/123/wallet/remove').send({
    content: case0.id,
  });
  expect(response.status).toBe(200);
  expect(response.body).toEqual(case0);
  expect((await fastify.wallet.get('123')).contents.length).toBe(2);
});

test('GET `/accounts/123/wallet/contents?type=JsonWebKey2020`', async () => {
  const response = await api.get(
    '/accounts/123/wallet/contents?type=JsonWebKey2020'
  );
  expect(response.status).toBe(200);
  expect(response.body.contents.length).toBe(2);
  expect(response.body.contents[0]).toEqual({
    id: 'did:web:platform.example:accounts:123#key-0',
    type: 'JsonWebKey2020',
    controller: 'did:web:platform.example:accounts:123',
    publicKeyJwk: {
      crv: 'Ed25519',
      x: 'Cbt14tXtdodI00aBKip3PokrO5bX-yaxawO8mHjIZvo',
      kty: 'OKP',
    },
  });
});
