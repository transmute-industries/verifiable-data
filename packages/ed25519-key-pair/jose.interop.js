const { generateKeyPair } = require('jose/util/generate_key_pair');
const { fromKeyLike } = require('jose/jwk/from_key_like');
const { Ed25519KeyPair } = require('./dist');

// jwk / base58 key conversion appears functional.
(async () => {
  const key = await generateKeyPair('EdDSA');
  const privateKeyJwk = await fromKeyLike(key.privateKey);

  console.log('good: ', JSON.stringify(privateKeyJwk, null, 2));
  const k = await Ed25519KeyPair.from({
    id: '',
    type: 'JsonWebKey2020',
    controller: '',
    publicKeyJwk: {
      ...privateKeyJwk,
    },
    privateKeyJwk: {
      ...privateKeyJwk,
    },
  });

  const exported1 = await k.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  });
  console.log('good: ', JSON.stringify(exported1, null, 2));

  const exported2 = await k.export({
    type: 'Ed25519VerificationKey2018',
    privateKey: true,
  });
  console.log('good?: ', JSON.stringify(exported2, null, 2));

  const imported1 = await Ed25519KeyPair.from(exported2);

  const exported3 = await imported1.export({
    type: 'JsonWebKey2020',
    privateKey: true,
  });

  console.log('good?: ', JSON.stringify(exported3, null, 2));

  const exported4 = await imported1.export({
    type: 'Ed25519VerificationKey2018',
    privateKey: true,
  });

  console.log('good?: ', JSON.stringify(exported4, null, 2));
})();
