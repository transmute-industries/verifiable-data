import { convertEndpointToDid } from './convertEndpointToDid';
import { convertDidToEndpoint } from './convertDidToEndpoint';

it('can convert well known endpoint to did', async () => {
  const did = await convertEndpointToDid(
    'https://example.com/.well-known/did.json'
  );
  expect(did).toBe('did:web:example.com');
  const endpoint = convertDidToEndpoint('did:web:example.com');
  expect(endpoint).toBe('https://example.com/.well-known/did.json');
});

it('can convert path based endpoint to did', async () => {
  const did = await convertEndpointToDid(
    'https://example.com/organizations/123/did.json'
  );
  expect(did).toBe('did:web:example.com:organizations:123');
  const endpoint = convertDidToEndpoint(
    'did:web:example.com:organizations:123'
  );
  expect(endpoint).toBe('https://example.com/organizations/123/did.json');
});
