import { JsonWebKey2020 } from '@transmute/web-crypto-key-pair';
import { JsonWebKey } from '..';

const options = [
  { kty: 'OKP', crv: 'Ed25519' },
  {
    kty: 'EC',
    crv: 'secp256k1',
  },
  {
    kty: 'EC',
    crv: 'P-256',
  },
  {
    kty: 'EC',
    crv: 'P-384',
  },
  {
    kty: 'EC',
    crv: 'P-521',
  },
];

options.forEach(opt => {
  describe(`${opt.kty} ${opt.crv}`, () => {
    it('generate / export / sign / verify', async () => {
      try {
        const k = await JsonWebKey.generate(opt);
        const kx = (await k.export({
          type: 'JsonWebKey2020',
          privateKey: true,
        })) as JsonWebKey2020;
        expect(kx.publicKeyJwk.kty).toBe(opt.kty);
        expect(kx.publicKeyJwk.crv).toBe(opt.crv);
        const message = Uint8Array.from(Buffer.from('hello'));
        const signature = await k.signer().sign({ data: message });
        const verified = await k.verifier().verify({
          data: message,
          signature,
        });
        expect(verified).toBe(true);
      } catch (e) {
        //
      }
    });
  });
});
