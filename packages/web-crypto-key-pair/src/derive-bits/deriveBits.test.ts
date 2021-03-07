import { keys } from '../__fixtures__';

import { deriveBitsFromJsonWebKey2020 } from './deriveBits';
for (let c in keys) {
  let k = keys[c];
  describe(`${k.type} ${k.publicKeyJwk.kty} ${k.publicKeyJwk.crv ||
    k.publicKeyJwk.alg}`, () => {
    if (k.publicKeyJwk.kty === 'RSA') {
      it('can NOT derive bits', async () => {
        try {
          await deriveBitsFromJsonWebKey2020(k, k);
        } catch (e) {
          expect(e.message).toBe(
            'deriveBits is not supported on this key type'
          );
        }
      });
    } else {
      it('can derive bits', async () => {
        const bits = await deriveBitsFromJsonWebKey2020(k, k);
        expect(bits.length).toBe(32);
      });
    }
  });
}
