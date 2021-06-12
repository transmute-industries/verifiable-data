import { Bls12381KeyPairs } from '@transmute/bls12381-key-pair';
import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';

import { getResolver } from '../getResolver';
import { DidDocumentRepresentation } from '../types';
import bls12381Fixture from '../__fixtures__/bls12381.json';
import ed25519Fixture from '../__fixtures__/ed25519.json';

const fixture: any = [
  {
    name: 'ed25519',
    data: ed25519Fixture,
    KeyPair: Ed25519KeyPair,
  },
  {
    name: 'bls12381',
    data: bls12381Fixture,
    KeyPair: Bls12381KeyPairs,
  },
];

fixture.forEach((f: any) => {
  describe(f.name, () => {
    Object.keys(f.data).forEach(did => {
      const contentTypes = Object.keys(
        f.data[did]
      ) as DidDocumentRepresentation[];
      contentTypes.forEach(ct => {
        describe(ct, () => {
          it(`can resolve ${did}`, async () => {
            const resolve = getResolver(f.KeyPair);
            const { didDocument } = await resolve(did, {
              accept: ct,
            });
            expect(didDocument).toEqual(f.data[did][ct]);
          });
        });
      });
    });
  });
});
