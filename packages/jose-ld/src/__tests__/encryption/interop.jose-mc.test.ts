import * as jose from 'jose';
import { TextEncoder } from 'util';
import { X25519KeyPair } from '@transmute/x25519-key-pair';
import { Cipher } from '../../JWE/Cipher';
const cipher = new Cipher();

const encoder = new TextEncoder();

const alg = 'ECDH-ES+A256KW';
const enc = 'A256GCM';

it('encrypt with jose, decrypt with mc', async () => {
  const { publicKeyJwk, privateKeyJwk } = {
    publicKeyJwk: {
      kty: 'OKP',
      crv: 'X25519',
      x: 'sJ4qz3Dvax-H2TVRDYXkK1onaafdO3mRL-qLj-KKKEI',
    },
    privateKeyJwk: {
      kty: 'OKP',
      crv: 'X25519',
      x: 'sJ4qz3Dvax-H2TVRDYXkK1onaafdO3mRL-qLj-KKKEI',
      d: 'mK2jV5pAes3Zw6wZZ89_6lJtDtyB_RltGVZzRXoO2ns',
    },
  };
  const message = {
    message: 'It’s a dangerous business, Frodo, going out your door.',
  };
  const plaintext = encoder.encode(JSON.stringify(message));
  const encryptor = new jose.GeneralEncrypt(plaintext);
  encryptor.setProtectedHeader({ enc });
  encryptor
    .addRecipient(await jose.importJWK(publicKeyJwk, alg))
    .setUnprotectedHeader({ alg, kid: 'did:example:123#key-0' });
  encryptor
    .addRecipient(await jose.importJWK(publicKeyJwk, alg))
    .setUnprotectedHeader({ alg, kid: 'did:example:123#key-1' });
  const ciphertext = await encryptor.encrypt();

  const decyptedPlaintext = await cipher.decrypt({
    jwe: ciphertext,
    keyAgreementKey: await X25519KeyPair.from({
      id: 'did:example:123#key-0',
      type: 'JsonWebKey2020',
      controller: 'did:example:123',
      publicKeyJwk,
      privateKeyJwk,
    }),
  });

  expect(JSON.parse(Buffer.from(decyptedPlaintext).toString('utf-8'))).toEqual(
    message
  );
});
