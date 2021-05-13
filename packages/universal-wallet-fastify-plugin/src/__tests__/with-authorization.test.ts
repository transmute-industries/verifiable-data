import walletPlugin from '../walletPlugin';
import walletRoutes from '../walletRoutes';
import { walletFactory } from '../walletFactory';
import { WalletOptions } from '../types';
import { documentLoader } from '../__fixtures__/documentLoader';

const supertest = require('supertest');
const Fastify = require('fastify');

const fastify = Fastify();

const customDocumentLoader = (iri: string) => {
  //  You may intercept requests here...

  return documentLoader(iri);
};

// normally this would be a get or create operation
// that probably already happened
const getAccountEncryptedWallet = async (accountId: string) => {
  const wallet = walletFactory.build();
  const seed = await wallet.passwordToKey(accountId);
  const contents = await wallet.generateContentFromSeed(seed);
  const did = wallet.convertEndpointToDid(
    'https://platform.example/accounts/123/did.json'
  );
  const keys = contents
    .filter((k: any) => {
      return k.type === 'JsonWebKey2020';
    })
    .map((k: any, i: number) => {
      let k1 = JSON.parse(JSON.stringify(k));
      k1.id = `${did}#key-${i}`;
      k1.controller = did;
      return {
        id: k1.id,
        type: k1.type,
        controller: k1.controller,
        publicKeyJwk: k1.publicKeyJwk,
        privateKeyJwk: k1.privateKeyJwk,
      };
    });
  keys.forEach((c: any) => {
    wallet.add(c);
  });
  const encryptedWallet = await wallet.export('elephant');
  return encryptedWallet;
};

const getAccountEncryptedWalletPassword = (_accountId: string) => {
  return 'elephant';
};

const get = async (accountId: string) => {
  const wallet = walletFactory.build();
  const accountEncryptedWallet = await getAccountEncryptedWallet(accountId);
  const password = await getAccountEncryptedWalletPassword(accountId);
  return wallet.import(accountEncryptedWallet, password);
};

test('should support preValidation hook', async () => {
  expect.assertions(3);
  const walletOptions: WalletOptions = {
    walletId: 'accountId',
    origin: 'https://platform.example',
    discovery: ['did:web'],
    apis: ['verifier'],
    documentLoader: customDocumentLoader,
    hooks: {
      preValidation: [
        (request: any, reply: any, done: any) => {
          // here is where you might add OIDC / OAuth Token Validation
          // Or other AuthN / AuthZ middlewares.
          expect(request.url).toBe('/accounts/123/did.json');
          expect(reply).toBeDefined();
          done();
        },
      ],
    },
    get,
  };

  fastify.register(walletPlugin(walletOptions));
  fastify.register(walletRoutes(walletOptions), { prefix: '/accounts' });

  await fastify.ready();
  const api = supertest(fastify.server);

  const response = await api.get('/accounts/123/did.json');
  expect(response.body['@context']).toEqual([
    'https://www.w3.org/ns/did/v1',
    'https://ns.did.ai/transmute/v1',
  ]);

  fastify.close();
});
