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

test('GET `/accounts/123/did.json` route', async () => {
  const response = await api
    .get('/accounts/123/did.json')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  // console.log(JSON.stringify(response.body, null, 2));
  expect(response.body['@context']).toBe('https://www.w3.org/ns/did/v1');
});
