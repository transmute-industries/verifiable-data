import { Ed25519KeyPair } from '..';

const { generateKeyPair } = require('jose/util/generate_key_pair');
const { fromKeyLike } = require('jose/jwk/from_key_like');

it('jose interop tests', async () => {
  const key = await generateKeyPair('EdDSA');
  const privateKeyJwk = await fromKeyLike(key.privateKey);
  const handCraftedJsonWebKeyPair = JSON.parse(
    JSON.stringify({
      id: '',
      type: 'JsonWebKey2020',
      controller: '',
      publicKeyJwk: {
        ...privateKeyJwk,
      },
      privateKeyJwk: {
        ...privateKeyJwk,
      },
    })
  );
  delete handCraftedJsonWebKeyPair.publicKeyJwk.d;
  const k = await Ed25519KeyPair.from(handCraftedJsonWebKeyPair);
  const exported1 = await k.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  });
  expect(exported1).toEqual(handCraftedJsonWebKeyPair);
  const exported2 = await k.export({
    type: 'Ed25519VerificationKey2018',
    privateKey: true,
  });
  const imported1 = await Ed25519KeyPair.from(exported2);
  const exported3 = await imported1.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  });
  // proves base58 key conversion is stable.
  expect(exported3).toEqual(handCraftedJsonWebKeyPair);

  const exported4 = await imported1.export({
    type: 'Ed25519VerificationKey2018',
    privateKey: true,
  });
  // proves base58 key conversion is stable.
  expect(exported4).toEqual(exported2);
});
