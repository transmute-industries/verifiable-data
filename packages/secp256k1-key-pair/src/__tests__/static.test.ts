import { Secp256k1KeyPair } from '../Secp256k1KeyPair';

it('matches fixtures 1', async () => {
  const seed =
    '9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c';
  const k = await Secp256k1KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(seed, 'hex');
    },
  });
  const k1 = await k.export({
    type: 'EcdsaSecp256k1VerificationKey2019',
    privateKey: true,
  });
  expect(k1).toEqual({
    id:
      'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme',
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: 'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme',
    publicKeyBase58: '23o6Sau8NxxzXcgSc3PLcNxrzrZpbLeBn1izfv3jbKhuv',
    privateKeyBase58: 'AjA4cyPUbbfW5wr6iZeRbJLhgH3qDt6q6LMkRw36KpxT',
  });

  const k2 = await k.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  });

  expect(k2).toEqual({
    id:
      'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme',
    type: 'JsonWebKey2020',
    controller: 'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'h0wVx_2iDlOcblulc8E5iEw1EYh5n1RYtLQfeSTyNc0',
      y: 'O2EATIGbu6DezKFptj5scAIRntgfecanVNXxat1rnwE',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'h0wVx_2iDlOcblulc8E5iEw1EYh5n1RYtLQfeSTyNc0',
      y: 'O2EATIGbu6DezKFptj5scAIRntgfecanVNXxat1rnwE',
      d: 'kIXSvvaShqbLtRYjyPolhimUXNVcpwXMTmZwA5aJTgw',
    },
  });

  const k3 = await Secp256k1KeyPair.from({
    id:
      'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme',
    type: 'JsonWebKey2020',
    controller: 'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'h0wVx_2iDlOcblulc8E5iEw1EYh5n1RYtLQfeSTyNc0',
      y: 'O2EATIGbu6DezKFptj5scAIRntgfecanVNXxat1rnwE',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'h0wVx_2iDlOcblulc8E5iEw1EYh5n1RYtLQfeSTyNc0',
      y: 'O2EATIGbu6DezKFptj5scAIRntgfecanVNXxat1rnwE',
      d: 'kIXSvvaShqbLtRYjyPolhimUXNVcpwXMTmZwA5aJTgw',
    },
  });

  const k33 = await k3.export({
    type: 'EcdsaSecp256k1VerificationKey2019',
    privateKey: true,
  });
  expect(k33).toEqual(k1);
});

it('matches fixtures 2', async () => {
  const seed =
    'f0f4df55a2b3ff13051ea814a8f24ad00f2e469af73c363ac7e9fb999a9072ed';
  const k = await Secp256k1KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(seed, 'hex');
    },
  });
  const k1 = await k.export({
    type: 'EcdsaSecp256k1VerificationKey2019',
    privateKey: true,
  });
  expect(k1).toEqual({
    id:
      'did:key:zQ3shtxV1FrJfhqE1dvxYRcCknWNjHc3c5X1y3ZSoPDi2aur2#zQ3shtxV1FrJfhqE1dvxYRcCknWNjHc3c5X1y3ZSoPDi2aur2',
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: 'did:key:zQ3shtxV1FrJfhqE1dvxYRcCknWNjHc3c5X1y3ZSoPDi2aur2',
    publicKeyBase58: '291KzQhqCPC18PqH83XKhxv1HdqrdnxyS7dh15t2uNRzJ',
    privateKeyBase58: 'HDbR1D5W3CoNbUKYzUbHH2PRF1atshtVupXgXTQhNB9E',
  });

  const k2 = await k.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  });

  expect(k2).toEqual({
    id:
      'did:key:zQ3shtxV1FrJfhqE1dvxYRcCknWNjHc3c5X1y3ZSoPDi2aur2#zQ3shtxV1FrJfhqE1dvxYRcCknWNjHc3c5X1y3ZSoPDi2aur2',
    type: 'JsonWebKey2020',
    controller: 'did:key:zQ3shtxV1FrJfhqE1dvxYRcCknWNjHc3c5X1y3ZSoPDi2aur2',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: '1LjPGVO9OOqfeaUcT9S-Ml_5wQOybbSQ0SGgMgG9U0M',
      y: 'aq-OS5tX6WqaY6fDHtATYwbIUijr8PvcGWd-FnCNQBM',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: '1LjPGVO9OOqfeaUcT9S-Ml_5wQOybbSQ0SGgMgG9U0M',
      y: 'aq-OS5tX6WqaY6fDHtATYwbIUijr8PvcGWd-FnCNQBM',
      d: '8PTfVaKz_xMFHqgUqPJK0A8uRpr3PDY6x-n7mZqQcu0',
    },
  });
});

it('matches fixtures 2', async () => {
  const seed =
    '6b0b91287ae3348f8c2f2552d766f30e3604867e34adc37ccbb74a8e6b893e02';
  const k = await Secp256k1KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(seed, 'hex');
    },
  });
  const k1 = await k.export({
    type: 'EcdsaSecp256k1VerificationKey2019',
    privateKey: true,
  });
  expect(k1).toEqual({
    id:
      'did:key:zQ3shZc2QzApp2oymGvQbzP8eKheVshBHbU4ZYjeXqwSKEn6N#zQ3shZc2QzApp2oymGvQbzP8eKheVshBHbU4ZYjeXqwSKEn6N',
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: 'did:key:zQ3shZc2QzApp2oymGvQbzP8eKheVshBHbU4ZYjeXqwSKEn6N',
    publicKeyBase58: 'oesQ92MLiAkt2pjBcJFbW7H4DvzKJv22cotjYbmC2JEe',
    privateKeyBase58: '8CrrWVdzDnvaS7vS5dd2HetFSebwEN46XEFrNDdtWZSZ',
  });

  const k2 = await k.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  });

  expect(k2).toEqual({
    id:
      'did:key:zQ3shZc2QzApp2oymGvQbzP8eKheVshBHbU4ZYjeXqwSKEn6N#zQ3shZc2QzApp2oymGvQbzP8eKheVshBHbU4ZYjeXqwSKEn6N',
    type: 'JsonWebKey2020',
    controller: 'did:key:zQ3shZc2QzApp2oymGvQbzP8eKheVshBHbU4ZYjeXqwSKEn6N',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'tS0TJpT9-UUpJvjMZUyA0C0oI9l7VW8d2ADptYRJVdM',
      y: 'RQEb5Z7oO52oHNpYk9lbbuwZmA_GFNenqSjX4joDh-A',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'tS0TJpT9-UUpJvjMZUyA0C0oI9l7VW8d2ADptYRJVdM',
      y: 'RQEb5Z7oO52oHNpYk9lbbuwZmA_GFNenqSjX4joDh-A',
      d: 'awuRKHrjNI-MLyVS12bzDjYEhn40rcN8y7dKjmuJPgI',
    },
  });
});
