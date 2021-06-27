import { X25519KeyPair, JsonWebKey2020 } from '../index';

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

it('generate', async () => {
  expect(k.id.startsWith('did:key:'));
  expect(k.controller.startsWith('did:key:'));
  expect(k.type).toBe('JsonWebKey2020');
  expect(k.publicKey.length).toBe(32);
  expect(k.privateKey?.length).toBe(32);
});

it('export', async () => {
  const k1 = (await k.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  })) as JsonWebKey2020;
  expect(k1.controller).toBe(
    'did:key:z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3'
  );
  expect(k1.publicKeyJwk).toEqual({
    kty: 'OKP',
    crv: 'X25519',
    x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
  });
  expect(k1.privateKeyJwk).toEqual({
    kty: 'OKP',
    crv: 'X25519',
    d: 'WisfN-zJ-38n4ao9qk1m2cPlSkwNzVOkpcrN-vUFeMs',
    x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
  });

  const k2 = (await k.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  })) as JsonWebKey2020;

  expect(k2.publicKeyJwk).toEqual({
    kty: 'OKP',
    crv: 'X25519',
    x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
  });
  expect(k2.privateKeyJwk).toEqual({
    kty: 'OKP',
    crv: 'X25519',
    d: 'WisfN-zJ-38n4ao9qk1m2cPlSkwNzVOkpcrN-vUFeMs',
    x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
  });
});

it('import', async () => {
  const kn = await X25519KeyPair.from({
    id: '',
    type: 'JsonWebKey2020',
    controller: '',
    publicKeyJwk: {
      kty: 'OKP',
      crv: 'X25519',
      x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
    },
    privateKeyJwk: {
      kty: 'OKP',
      crv: 'X25519',
      d: 'WisfN-zJ-38n4ao9qk1m2cPlSkwNzVOkpcrN-vUFeMs',
      x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
    },
  });
  const k1 = (await kn.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  })) as JsonWebKey2020;
  expect(k1.privateKeyJwk).toEqual({
    kty: 'OKP',
    crv: 'X25519',
    d: 'WisfN-zJ-38n4ao9qk1m2cPlSkwNzVOkpcrN-vUFeMs',
    x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
  });
});

it('fingerprintFromPublicKey', async () => {
  const f = await X25519KeyPair.fingerprintFromPublicKey(
    (await k.export({ type: 'JsonWebKey2020' })) as JsonWebKey2020
  );
  expect(f).toBe('z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3');
});

it('fingerprint', async () => {
  const f = await k.fingerprint();
  expect(f).toBe('z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3');
});

it('deriveSecret', async () => {
  const s = await k.deriveSecret({
    publicKey: await k.export({ type: 'JsonWebKey2020', privateKey: false }),
  });
  expect(s.length).toBe(32);
});

it('fromFingerprint', async () => {
  const kn = await X25519KeyPair.fromFingerprint({
    fingerprint: 'z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3',
  });
  const kx = await kn.export({ type: 'JsonWebKey2020' });
  expect(kx).toEqual({
    id:
      'did:key:z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3#z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3',
    type: 'JsonWebKey2020',
    controller: 'did:key:z6LSmj99jDmtGRf67cjCwaavf1oEdEwMcWZ8mh9Q7yTjWrP3',
    publicKeyJwk: {
      kty: 'OKP',
      crv: 'X25519',
      x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
    },
  });
});
