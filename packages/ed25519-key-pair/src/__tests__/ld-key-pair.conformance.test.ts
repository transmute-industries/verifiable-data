import { Ed25519KeyPair, JsonWebKey2020 } from '../index';

let k: Ed25519KeyPair;

beforeAll(async () => {
  k = await Ed25519KeyPair.generate({
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
  expect(k.privateKey?.length).toBe(64);
});

it('JWK import / export ', async () => {
  const kn = await Ed25519KeyPair.from({
    id: '',
    type: 'JsonWebKey2020',
    controller: '',
    publicKeyJwk: {
      kty: 'OKP',
      crv: 'Ed25519',
      x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
    },
    privateKeyJwk: {
      kty: 'OKP',
      crv: 'Ed25519',
      d: 'WisfN-zJ-38n4ao9qk1m2cPlSkwNzVOkpcrN-vUFeMs',
      x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
    },
  });
  const kx = await kn.export({ type: 'JsonWebKey2020', privateKey: true });

  expect(kx).toEqual({
    id: '',
    type: 'JsonWebKey2020',
    controller: '',
    publicKeyJwk: {
      kty: 'OKP',
      crv: 'Ed25519',
      x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
    },
    privateKeyJwk: {
      kty: 'OKP',
      crv: 'Ed25519',
      x: 'lVdVtPzTGXvkWLaSuxk-WFvOSxnVThxrEoRPJLrkCko',
      d: 'WisfN-zJ-38n4ao9qk1m2cPlSkwNzVOkpcrN-vUFeMs',
    },
  });
});

it('Base58 import / export ', async () => {
  const kn = await Ed25519KeyPair.from({
    id:
      'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL#z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL',
    type: 'Ed25519VerificationKey2018',
    controller: 'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL',
    publicKeyBase58: '6fioC1zcDPyPEL19pXRS2E4iJ46zH7xP6uSgAaPdwDrx',
    privateKeyBase58:
      '2b5J8uecvwAo9HUGge5NKQ7HoRNKUKCjZ7Fr4mDgWkwqATnLmZDx7Seu6NqTuFKkxuHNT27GcoxVZQCkWJhNvaUQ',
  });
  const kx = await kn.export({
    type: 'Ed25519VerificationKey2018',
    privateKey: true,
  });
  expect(kx).toEqual({
    id:
      'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL#z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL',
    type: 'Ed25519VerificationKey2018',
    controller: 'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL',
    publicKeyBase58: '6fioC1zcDPyPEL19pXRS2E4iJ46zH7xP6uSgAaPdwDrx',
    privateKeyBase58:
      '2b5J8uecvwAo9HUGge5NKQ7HoRNKUKCjZ7Fr4mDgWkwqATnLmZDx7Seu6NqTuFKkxuHNT27GcoxVZQCkWJhNvaUQ',
  });
});

it('fingerprintFromPublicKey', async () => {
  const f = await Ed25519KeyPair.fingerprintFromPublicKey(
    (await k.export({ type: 'JsonWebKey2020' })) as JsonWebKey2020
  );
  expect(f).toBe('z6MknEe43MdJM5beyaMQcMoDXYmakzoxBiE9hpvkyhkN1naX');
});

it('fingerprint', async () => {
  const f = await k.fingerprint();
  expect(f).toBe('z6MknEe43MdJM5beyaMQcMoDXYmakzoxBiE9hpvkyhkN1naX');
});

it('fromFingerprint', async () => {
  const kn = await Ed25519KeyPair.fromFingerprint({
    fingerprint: 'z6MknEe43MdJM5beyaMQcMoDXYmakzoxBiE9hpvkyhkN1naX',
  });
  const kx = await kn.export({ type: 'JsonWebKey2020' });
  expect(kx).toEqual({
    id:
      'did:key:z6MknEe43MdJM5beyaMQcMoDXYmakzoxBiE9hpvkyhkN1naX#z6MknEe43MdJM5beyaMQcMoDXYmakzoxBiE9hpvkyhkN1naX',
    type: 'JsonWebKey2020',
    controller: 'did:key:z6MknEe43MdJM5beyaMQcMoDXYmakzoxBiE9hpvkyhkN1naX',
    publicKeyJwk: {
      kty: 'OKP',
      crv: 'Ed25519',
      x: 'c6HUQw5OfnwQjxvHIEK_2OclSUdqbiZWdFMmSMprWhw',
    },
  });
});
