import { Bls12381KeyPairs } from '@transmute/bls12381-key-pair';
import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';
import { X25519KeyPair } from '@transmute/x25519-key-pair';
import { KeyPair } from '@transmute/web-crypto-key-pair';
import { Secp256k1KeyPair } from '@transmute/secp256k1-key-pair';

import { getResolver } from '../getResolver';
import { DidDocumentRepresentation } from '../types';
import ed25519Fixture from '../__fixtures__/ed25519.json';
import x25519Fixture from '../__fixtures__/x25519.json';
import bls12381Fixture from '../__fixtures__/bls12381.json';
import secp256k1Fixture from '../__fixtures__/secp256k1.json';
import p256Fixture from '../__fixtures__/p256.json';
import p384Fixture from '../__fixtures__/p384.json';
import p521Fixture from '../__fixtures__/p521.json';

const fixture: any = [
  {
    name: 'ed25519',
    data: ed25519Fixture,
    KeyPair: Ed25519KeyPair,
  },
  {
    name: 'x25519',
    data: x25519Fixture,
    KeyPair: X25519KeyPair,
  },
  {
    name: 'bls12381',
    data: bls12381Fixture,
    KeyPair: Bls12381KeyPairs,
  },
  {
    name: 'secp256k1',
    data: secp256k1Fixture,
    KeyPair: Secp256k1KeyPair,
  },
  {
    name: 'p256',
    data: p256Fixture,
    KeyPair: KeyPair,
  },
  {
    name: 'p384',
    data: p384Fixture,
    KeyPair: KeyPair,
  },
  {
    name: 'p521',
    data: p521Fixture,
    KeyPair: KeyPair,
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
            // console.log(JSON.stringify(didDocument, null, 2));
            expect(didDocument).toEqual(f.data[did][ct]);
          });
        });
      });
    });
  });
});
