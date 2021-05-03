import { WalletOptions } from '../types';
import walletPlugin from '../walletPlugin';

import { documentLoader } from '../__fixtures__/documentLoader';
const supertest = require('supertest');
const Fastify = require('fastify');
function buildFastify() {
  const fastify = Fastify();

  const walletOptions: WalletOptions = {
    walletId: 'accountId',
    documentLoader,
    get: (accountId: string) => ({ accountId } as any),
  };

  fastify.register(walletPlugin(walletOptions));
  fastify.get('/accounts/:accountId', async (request: any, reply: any) => {
    const wallet = await fastify.wallet.get(request.params.accountId);
    reply.send({ hello: 'world', wallet });
  });
  return fastify;
}

const fastify = buildFastify();

let api: any;

beforeAll(async () => {
  await fastify.ready();
  api = supertest(fastify.server);
});

afterAll(() => {
  fastify.close();
});

test('GET `/accounts/123` route', async () => {
  const response = await api
    .get('/accounts/123')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  expect(response.body).toEqual({
    hello: 'world',
    wallet: { accountId: '123' },
  });
});
