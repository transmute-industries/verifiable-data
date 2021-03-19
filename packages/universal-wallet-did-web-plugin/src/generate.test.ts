import { generate } from './generate';

it('can generate from root', async () => {
  const { keys, didDocument } = await generate(
    'https://example.com/.well-known/did.json'
  );
  expect(keys.length).toBe(6);
  expect(didDocument.id).toBe('did:web:example.com');
});
