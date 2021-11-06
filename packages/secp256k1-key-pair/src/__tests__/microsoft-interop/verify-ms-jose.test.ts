import { verify } from '../../__fixtures__/jose-help';
const publicKeyJwk = require('./__fixtures__/ms.publicKeyJwk.json');

describe('jose ES256K', () => {
  it('can verify complex object', async () => {
    const { jws } = require('./__fixtures__/ms.complex-object-signed.json');
    const verified = await verify(jws, publicKeyJwk);
    expect(verified).toBe(true);
  });
});
