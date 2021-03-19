import { factory } from './factory';

it('can build a didWebWallet with defaults', async () => {
  const wallet = factory.build();
  expect(wallet.didDocuments).toBeDefined();
});

it('can generate', async () => {
  const wallet = await factory
    .build()
    .generate('https://example.com/organizations/123/did.json');
  const didDocument = await wallet.didDocuments[
    'did:web:example.com:organizations:123'
  ].produce('application/did+ld+json');
  expect(didDocument).toBeDefined();
  expect(Object.keys(wallet.verificationMethods)).toEqual([
    'did:web:example.com:organizations:123#key-0',
    'did:web:example.com:organizations:123#key-1',
    'did:web:example.com:organizations:123#key-2',
    'did:web:example.com:organizations:123#key-3',
    'did:web:example.com:organizations:123#key-4',
    'did:web:example.com:organizations:123#key-5',
  ]);
});
