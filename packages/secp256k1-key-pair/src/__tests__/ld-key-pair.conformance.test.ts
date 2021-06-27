import crypto from 'crypto';

import { Secp256k1KeyPair, JsonWebKey2020 } from '../index';

let k: Secp256k1KeyPair;
beforeAll(async () => {
  k = await Secp256k1KeyPair.generate({
    secureRandom: () => {
      return Uint8Array.from(
        Buffer.from(
          '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
          'hex'
        )
      );
    },
  });
});

it('generate', async () => {
  const kn = await Secp256k1KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  });
  expect(kn.id.startsWith('did:key:'));
  expect(kn.controller.startsWith('did:key:'));
  expect(kn.type).toBe('JsonWebKey2020');
  expect(kn.publicKey.length).toBe(33);
  expect(kn.privateKey?.length).toBe(32);
});

it('export', async () => {
  const k1 = (await k.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  })) as JsonWebKey2020;
  expect(k1.controller).toBe(
    'did:key:zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX'
  );
  expect(k1.publicKeyJwk).toEqual({
    kty: 'EC',
    crv: 'secp256k1',
    x: 'ZCkxL14Ix2EDzwOIOJ5D_kNG7lAzIAkO7aFQ82Kru0w',
    y: 'dvzo1xuPbe7pTelHPEjP_BCF-S-n34NBxU3qC57PdgQ',
  });
  expect(k1.privateKeyJwk).toEqual({
    kty: 'EC',
    crv: 'secp256k1',
    x: 'ZCkxL14Ix2EDzwOIOJ5D_kNG7lAzIAkO7aFQ82Kru0w',
    y: 'dvzo1xuPbe7pTelHPEjP_BCF-S-n34NBxU3qC57PdgQ',
    d: 'TmG8GRjqakeuMwczG-d5gZahqOfP5Lbo98ml82AX2Sk',
  });
});

it('import', async () => {
  const kn = await Secp256k1KeyPair.from({
    id: 'did:example:123#1',
    controller: 'did:example:123',
    type: 'JsonWebKey2020',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'F0UpAkmilL3GafMgs_NMLqwGpUYPEnFphet8wS21jMg',
      y: 'vTGyefjnlCj2-T7gYw3Det6m1UtDOfbB4CTzROlT6QA',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      d: 'H8IPdO0ZRDrma0Oc1ASGp4R-7ioP3HKC2o3dBYLHUg',
      x: 'F0UpAkmilL3GafMgs_NMLqwGpUYPEnFphet8wS21jMg',
      y: 'vTGyefjnlCj2-T7gYw3Det6m1UtDOfbB4CTzROlT6QA',
    },
  });
  const k1 = (await kn.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  })) as JsonWebKey2020;

  expect(k1.privateKeyJwk).toEqual({
    kty: 'EC',
    crv: 'secp256k1',
    d: 'H8IPdO0ZRDrma0Oc1ASGp4R-7ioP3HKC2o3dBYLHUg',
    x: 'F0UpAkmilL3GafMgs_NMLqwGpUYPEnFphet8wS21jMg',
    y: 'vTGyefjnlCj2-T7gYw3Det6m1UtDOfbB4CTzROlT6QA',
  });
});

it('fingerprintFromPublicKey', async () => {
  const f = await Secp256k1KeyPair.fingerprintFromPublicKey(
    (await k.export({ type: 'JsonWebKey2020' })) as JsonWebKey2020
  );
  expect(f).toBe('zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX');
});

it('fingerprint', async () => {
  const f = await k.fingerprint();
  expect(f).toBe('zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX');
});

it('signer', async () => {
  const signer = k.signer();
  expect(signer.sign).toBeDefined();
});

it('verifier', async () => {
  const verifier = k.verifier();
  expect(verifier.verify).toBeDefined();
});

it('deriveSecret', async () => {
  const s = await k.deriveSecret({
    publicKey: await k.export({ type: 'JsonWebKey2020', privateKey: false }),
  });
  expect(s.length).toBe(32);
});

it('fromFingerprint', async () => {
  const kn = await Secp256k1KeyPair.fromFingerprint({
    fingerprint: 'zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX',
  });
  const kx = await kn.export({ type: 'JsonWebKey2020', privateKey: true });

  expect(kx).toEqual({
    id:
      'did:key:zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX#zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX',
    type: 'JsonWebKey2020',
    controller: 'did:key:zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'ZCkxL14Ix2EDzwOIOJ5D_kNG7lAzIAkO7aFQ82Kru0w',
      y: 'dvzo1xuPbe7pTelHPEjP_BCF-S-n34NBxU3qC57PdgQ',
    },
  });
});
