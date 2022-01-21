import fs from 'fs';
import path from 'path';
import { Ed25519KeyPair } from '../../index';

import { base64url } from '../../encoding';

const header = { alg: 'EdDSA' };
const privateKeyJwk = require('./__fixtures__/transmute.privateKeyJwk.json');

describe('transmute EdDSA', () => {
  it.skip('can generate key pair', async () => {
    const k = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Uint8Array.from(
          Buffer.from(
            '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
            'hex'
          )
        );
      },
    });
    const { privateKeyJwk }: any = await k.export({
      type: 'JsonWebKey2020',
      privateKey: true,
    });
    fs.writeFileSync(
      path.resolve(__dirname, './__fixtures__/transmute.privateKeyJwk.json'),
      JSON.stringify(privateKeyJwk, null, 2)
    );
  });

  it('can sign and verify simple string', async () => {
    const { payload } = require('./__fixtures__/simple-string-payload.json');
    const k = await Ed25519KeyPair.from({
      type: 'JsonWebKey2020',
      privateKeyJwk,
      publicKeyJwk: privateKeyJwk,
    } as any);
    const signer = k.signer();
    const message =
      base64url.encode(JSON.stringify(header)) +
      '.' +
      base64url.encode(payload);

    const signature = await signer.sign({ data: Buffer.from(message) });
    const jws = message + '.' + base64url.encode(signature);
    const verifier = k.verifier();
    const [_1, _2, _3] = jws.split('.');
    const verified = await verifier.verify({
      data: Buffer.from([_1, _2].join('.')),
      signature: Buffer.from(_3, 'base64'),
    });
    expect(verified).toBe(true);
    fs.writeFileSync(
      path.resolve(
        __dirname,
        './__fixtures__/transmute.simple-string-signed.json'
      ),
      JSON.stringify({ jws }, null, 2)
    );
  });

  it('can sign and verify complex object', async () => {
    const payload = require('./__fixtures__/complex-object-payload.json');
    const k = await Ed25519KeyPair.from({
      type: 'JsonWebKey2020',
      privateKeyJwk,
      publicKeyJwk: privateKeyJwk,
    } as any);
    const signer = k.signer();
    const message =
      base64url.encode(JSON.stringify(header)) +
      '.' +
      base64url.encode(JSON.stringify(payload));
    const signature = await signer.sign({ data: Buffer.from(message) });
    const jws = message + '.' + base64url.encode(signature);
    const verifier = k.verifier();
    const [_1, _2, _3] = jws.split('.');
    const verified = await verifier.verify({
      data: Buffer.from([_1, _2].join('.')),
      signature: Buffer.from(_3, 'base64'),
    });
    expect(verified).toBe(true);
    fs.writeFileSync(
      path.resolve(
        __dirname,
        './__fixtures__/transmute.complex-object-signed.json'
      ),
      JSON.stringify({ jws }, null, 2)
    );
  });
});
