import { Secp256k1KeyPair } from '../../index';

const privateKeyJwk = require('./__fixtures__/jose.privateKeyJwk.json');

describe('transmute ES256K', () => {
  it('can verify simple string', async () => {
    const { jws } = require('./__fixtures__/jose.simple-string-signed.json');
    const k = await Secp256k1KeyPair.from({
      type: 'JsonWebKey2020',
      privateKeyJwk,
      publicKeyJwk: privateKeyJwk,
    } as any);
    const verifier = k.verifier();
    const [_1, _2, signature] = jws.split('.');
    const verified = await verifier.verify({
      data: Buffer.from([_1, _2].join('.')),
      signature: Buffer.from(signature, 'base64'),
    });
    expect(verified).toBe(true);
  });

  it('can verify complex object', async () => {
    const { jws } = require('./__fixtures__/jose.complex-object-signed.json');
    const k = await Secp256k1KeyPair.from({
      type: 'JsonWebKey2020',
      privateKeyJwk,
      publicKeyJwk: privateKeyJwk,
    } as any);
    const verifier = k.verifier();
    const [_1, _2, signature] = jws.split('.');
    const verified = await verifier.verify({
      data: Buffer.from([_1, _2].join('.')),
      signature: Buffer.from(signature, 'base64'),
    });
    expect(verified).toBe(true);
  });
});
