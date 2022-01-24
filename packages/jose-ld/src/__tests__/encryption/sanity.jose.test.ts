import * as jose from 'jose';
import { TextEncoder, TextDecoder } from 'util';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const alg = 'ECDH-ES+A256KW';
const crv = 'X25519';
const enc = 'A256GCM';
it('can generate key pair', async () => {
  const { publicKey, privateKey } = await jose.generateKeyPair(alg, {
    crv,
  });

  const publicKeyJwk = await jose.exportJWK(publicKey);

  expect(publicKeyJwk.kty).toBe('OKP');
  expect(publicKeyJwk.crv).toBe(crv);
  expect(publicKeyJwk.x).toBeDefined();
  expect(publicKeyJwk.d).not.toBeDefined();

  const privateKeyJwk = await jose.exportJWK(privateKey);
  expect(privateKeyJwk.kty).toBe('OKP');
  expect(privateKeyJwk.crv).toBe(crv);
  expect(privateKeyJwk.x).toBeDefined();
  expect(privateKeyJwk.d).toBeDefined();
});

it('can encrypt / decrypt', async () => {
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
  const decrypted = await jose.generalDecrypt(
    ciphertext,
    await jose.importJWK(privateKeyJwk, alg)
  );
  expect(JSON.parse(decoder.decode(decrypted.plaintext))).toEqual(message);
});
