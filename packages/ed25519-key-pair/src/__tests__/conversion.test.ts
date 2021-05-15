import { Ed25519KeyPair } from '../index';

let k: Ed25519KeyPair;

beforeAll(async () => {
  k = await Ed25519KeyPair.generate({
    secureRandom: () => {
      return Uint8Array.from(
        Buffer.from(
          '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
          'hex'
        )
      );
    },
  });
});

it('toX25519KeyPair', async () => {
  const kx = await Ed25519KeyPair.toX25519KeyPair(k);
  const kxi = await kx.export({ type: 'JsonWebKey2020', privateKey: true });
  // note the controller is retained on conversion.
  expect(kxi).toEqual({
    id:
      'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL#z6LSrdqo4M24WRDJj1h2hXxgtDTyzjjKCiyapYVgrhwZAySn',
    type: 'JsonWebKey2020',
    controller: 'did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL',
    publicKeyJwk: {
      kty: 'OKP',
      crv: 'X25519',
      x: '3kY9jl1by7pLzgJktUH-e9H6fihdVUb00-sTzkfmIl8',
    },
    privateKeyJwk: {
      kty: 'OKP',
      crv: 'X25519',
      x: '3kY9jl1by7pLzgJktUH-e9H6fihdVUb00-sTzkfmIl8',
      d: 'yOii2I93KEK1OynBG6npPHFcOuigxrB8qZY_Dd_XfnI',
    },
  });
});
