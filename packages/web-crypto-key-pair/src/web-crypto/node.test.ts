import * as node from './node';

//  KEEP: use to dump fixtures
//  console.log(JSON.stringify(kp, null, 2));

describe('generate', () => {
  it('can generate P-256', async () => {
    const opts = { kty: 'EC', crvOrSize: 'P-256' };
    const kp = await node.generate(opts);
    expect(kp.publicKeyJwk.kty).toBe(opts.kty);
    expect(kp.publicKeyJwk.crv).toBe(opts.crvOrSize);
  });

  it('can generate P-384', async () => {
    const opts = { kty: 'EC', crvOrSize: 'P-384' };
    const kp = await node.generate(opts);
    expect(kp.publicKeyJwk.kty).toBe(opts.kty);
    expect(kp.publicKeyJwk.crv).toBe(opts.crvOrSize);
  });

  it('can generate P-521', async () => {
    const opts = { kty: 'EC', crvOrSize: 'P-521' };
    const kp = await node.generate(opts);
    expect(kp.publicKeyJwk.kty).toBe(opts.kty);
    expect(kp.publicKeyJwk.crv).toBe(opts.crvOrSize);
  });

  it('can generate RSASSA-PKCS1-v1_5', async () => {
    const opts = { kty: 'RSASSA-PKCS1-v1_5', crvOrSize: '2048' };
    const kp = await node.generate(opts);
    expect(kp.publicKeyJwk.kty).toBe('RSA');
  });
});
