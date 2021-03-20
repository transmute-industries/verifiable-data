const supertest = require('supertest');
const Fastify = require('fastify');

function buildFastify() {
  const fastify = Fastify();

  fastify.get('/', function(_request: any, reply: any) {
    reply.send({ hello: 'world' });
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

test('GET `/` route', async () => {
  const response = await api
    .get('/')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8');
  expect(response.body).toEqual({ hello: 'world' });
});
