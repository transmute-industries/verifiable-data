import { getFastifyWithWalletOptions, walletOptions } from './utils';
import { case1 as vc } from '../__fixtures__/verifiableCredentials';
import { documentLoader } from '../__fixtures__/documentLoader';
const supertest = require('supertest');

let api: any;
let fastify: any;

const customDocumentLoader = (iri: string) => {
  //  You may intercept requests here...
  if (
    iri === 'https://w3c-ccg.github.io/vc-http-api/fixtures/revocationList.json'
  ) {
    return {
      documentUrl: iri,
      document: require('../test-data/rl-vc.json'),
    };
  }
  return documentLoader(iri);
};

beforeAll(async () => {
  fastify = getFastifyWithWalletOptions({
    ...walletOptions,
    documentLoader: customDocumentLoader,
  });
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
