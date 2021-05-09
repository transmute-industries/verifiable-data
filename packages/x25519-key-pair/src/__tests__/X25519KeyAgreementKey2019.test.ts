import { X25519KeyPair } from '../index';

let k: X25519KeyPair;

beforeAll(async () => {
  k = await X25519KeyPair.generate({
    secureRandom: () => {
      return Uint8Array.from(
        Buffer.from(
          '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
          'hex'
        )
      );
    },
  });
});

it('export', async () => {
  const kn = await k.export({
    type: 'X25519KeyAgreementKey2019',
    privateKey: true,
  });
  expect(kn).toEqual({
    id:
      'did:key:z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3#z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3',
    type: 'X25519KeyAgreementKey2019',
    controller: 'did:key:z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3',
    publicKeyBase58: 'B3xzCuy2AxwM2EMSQw4yLRakn6QEuuNytiRidWpCoUcH',
    privateKeyBase58: '74yq9M4KR9tpTxEU3xW43ui5RETguLvGqhftjrMz3oMk',
  });
});

it('import', async () => {
  const kn = await X25519KeyPair.from({
    id:
      'did:key:z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3#z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3',
    type: 'X25519KeyAgreementKey2019',
    controller: 'did:key:z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3',
    publicKeyBase58: 'B3xzCuy2AxwM2EMSQw4yLRakn6QEuuNytiRidWpCoUcH',
    privateKeyBase58: '74yq9M4KR9tpTxEU3xW43ui5RETguLvGqhftjrMz3oMk',
  });
  const k2 = await kn.export({
    type: 'X25519KeyAgreementKey2019',
    privateKey: true,
  });
  expect(k2).toEqual({
    id:
      'did:key:z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3#z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3',
    type: 'X25519KeyAgreementKey2019',
    controller: 'did:key:z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3',
    publicKeyBase58: 'B3xzCuy2AxwM2EMSQw4yLRakn6QEuuNytiRidWpCoUcH',
    privateKeyBase58: '74yq9M4KR9tpTxEU3xW43ui5RETguLvGqhftjrMz3oMk',
  });
});

it('deriveSecret', async () => {
  const s = await k.deriveSecret({
    publicKey: await k.export({
      type: 'X25519KeyAgreementKey2019',
      privateKey: false,
    }),
  });
  expect(s.length).toBe(32);
});
