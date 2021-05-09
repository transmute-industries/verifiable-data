import { Secp256k1KeyPair } from '../index';

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

it('JsonWebKey2020', async () => {
  const kn = await k.export({ type: 'JsonWebKey2020', privateKey: true });
  expect(kn).toEqual({
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
    privateKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'ZCkxL14Ix2EDzwOIOJ5D_kNG7lAzIAkO7aFQ82Kru0w',
      y: 'dvzo1xuPbe7pTelHPEjP_BCF-S-n34NBxU3qC57PdgQ',
      d: 'TmG8GRjqakeuMwczG-d5gZahqOfP5Lbo98ml82AX2Sk',
    },
  });
});

it('EcdsaSecp256k1VerificationKey2019', async () => {
  const kn = await k.export({
    type: 'EcdsaSecp256k1VerificationKey2019',
    privateKey: true,
  });
  expect(kn).toEqual({
    id:
      'did:key:zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX#zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX',
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: 'did:key:zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX',
    publicKeyBase58: 'iCcwcQBt8hPmfj9NzGCpuDZrHAryuByUvCKHTc1F4tJo',
    privateKeyBase58: '6GyEn649EsbEEJXGQ5m8Eq6NANDmHTPQPWGyF5uL7kx8',
  });
});

it('EcdsaSecp256k1VerificationKey2020', async () => {
  expect.assertions(2);
  let kn = await k.export({
    type: 'EcdsaSecp256k1VerificationKey2020',
    privateKey: false,
  });
  expect(kn).toEqual({
    id:
      'did:key:zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX#zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX',
    type: 'EcdsaSecp256k1VerificationKey2020',
    controller: 'did:key:zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX',
    publicKeyMultibase: 'zQ3shU9mxTYfMTLceuppoNM5siowHvw3xBk21r855kwgNHNAX',
  });
  try {
    await k.export({
      type: 'EcdsaSecp256k1VerificationKey2020',
      privateKey: true,
    });
  } catch (e) {
    expect(e.message).toBe(
      'Unable to represent secp256k1 private key in multibase. See https://github.com/multiformats/multicodec/pull/210'
    );
  }
});
