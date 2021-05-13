import supertest, { SuperTest, Test } from 'supertest';
import Ajv from 'ajv';

import { getFastifyWithWalletOptions, walletOptions } from './utils';
import { case2 } from '../__fixtures__/verifiableCredentials';
import { UniversalWalletFastifyInstance } from '../types';
import vcSchema from '../schemas/verifiable-credential.json';
import presentationSubmission from '../__fixtures__/presentationSubmissions/case-0.json';

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

    it('should filter out not allowed properties', async () => {
      const invalidSchema = {
        ...case2,
        anUndocumentedProperty: true,
      };
      const postResponse = await api
        .post('/accounts/456/wallet/contents')
        .send({
          content: invalidSchema,
        });
      expect(postResponse.status).toBe(200);
      expect(postResponse.body).toEqual({});

      const getResponse = await api.get(
        '/accounts/456/wallet/contents/query?type=VerifiableCredential'
      );
      expect(getResponse.body.anUndocumentedProperty).toBeUndefined();
      expect(getResponse.body.contents[0]).toEqual(case2);
    });

    it('gets the credential', async () => {
      const response = await api.get(
        '/accounts/123/wallet/contents/query?type=VerifiableCredential'
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
      expect(response.body.contents[0].credentialSubject).toBeDefined();
    });
  });
  describe('presentation submission', () => {
    it('should add presentation submission to the wallet', async () => {
      const response = await api.post('/accounts/123/wallet/contents').send({
        content: presentationSubmission,
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });
    it('should get presentation submission with all expected fields', async () => {
      const response = await api.get(
        '/accounts/123/wallet/contents/query?type=Submission'
      );
      expect(response.status).toBe(200);
      expect(response.body.contents).toHaveLength(1);
      expect(response.body.contents[0].type).toEqual(['Submission']);
      expect(response.body.contents[0].id).toBeDefined();
      expect(response.body.contents[0].sender).toBeDefined();
      expect(response.body.contents[0].receiver).toBeDefined();
      expect(response.body.contents[0].status).toBeDefined();
      expect(response.body.contents[0].verifiablePresentation).toBeDefined();
    });
  });
  describe('multiple types', () => {
    it('can get content by 2 different types', async () => {
      const response = await api.get(
        '/accounts/123/wallet/contents/query?type=Submission&type=VerifiableCredential'
      );
      expect(response.status).toBe(200);
      expect(response.body.contents).toHaveLength(2);
    });
  });
});
