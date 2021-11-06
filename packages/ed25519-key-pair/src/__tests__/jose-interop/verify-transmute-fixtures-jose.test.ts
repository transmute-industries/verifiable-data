import { verify } from '../../__fixtures__/jose-help';
const privateKeyJwk = require('./__fixtures__/transmute.privateKeyJwk.json');

describe('jose EdDSA', () => {
  it('can verify simple string', async () => {
    const {
      jws,
    } = require('./__fixtures__/transmute.simple-string-signed.json');
    const verified = await verify(jws, privateKeyJwk);
    expect(verified).toBe(true);
  });

  it('can verify complex object', async () => {
    const {
      jws,
    } = require('./__fixtures__/transmute.complex-object-signed.json');
    const verified = await verify(jws, privateKeyJwk);
    expect(verified).toBe(true);
  });
});
