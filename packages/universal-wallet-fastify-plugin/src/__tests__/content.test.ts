import supertest, { SuperTest, Test } from 'supertest';
import Ajv from 'ajv';

import { getFastifyWithWalletOptions, walletOptions } from './utils';
import { case2 } from '../__fixtures__/verifiableCredentials';
import { UniversalWalletFastifyInstance } from '../types';
import vcSchema from '../schemas/verifiable-credential.json';

let api: SuperTest<Test>;
let fastify: UniversalWalletFastifyInstance;

beforeAll(async () => {
  fastify = getFastifyWithWalletOptions(walletOptions);
  await fastify.ready();
  api = supertest(fastify.server);
});

afterAll(() => {
  fastify.close();
});

describe('content endpoint', () => {
  describe('vc content', () => {
    it('creates the credential', async () => {
      const response = await api.post('/accounts/123/wallet/contents').send({
        content: case2,
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });
    it.todo('throws 500 because credential does not match schema');
    it('gets the credential', async () => {
      const response = await api.get(
        '/accounts/123/wallet/contents?type=VerifiableCredential'
      );
      expect(response.status).toBe(200);
      expect(response.body.contents).toHaveLength(1);
      // validate the schema here
      const ajv = new Ajv();
      const validate = ajv.compile(vcSchema);
      const valid = validate(response.body.contents[0]);
      if (!valid) console.log(validate.errors);
      expect(response.body.contents[0]).toBeDefined();
      expect(valid).toBeTruthy();
      // expect(response.body.contents[0].credentialSubject).toBeDefined();
    });
  });
});
