// import * as jose from 'jose';
// import { TextEncoder, TextDecoder } from 'util';

// const encoder = new TextEncoder();
// const decoder = new TextDecoder();
// const alg = 'ECDH-ES+A256KW';
// const crv = 'X25519';
// const enc = 'A256GCM';

import { Cipher } from '../../JWE/Cipher';
import { X25519KeyPair } from '@transmute/x25519-key-pair';

const cipher = new Cipher();

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
  const recipients = [
    {
      header: {
        kid: 'did:example:123#key-0',
        alg: 'ECDH-ES+A256KW',
      },
    },
    {
      header: {
        kid: 'did:example:123#key-1',
        alg: 'ECDH-ES+A256KW',
      },
    },
  ];
  const jwe = await cipher.encryptObject({
    obj: message,
    recipients,
    publicKeyResolver: async (id: string) => {
      return { id, type: 'JsonWebKey2020', publicKeyJwk };
    },
  });
  const plaintext = await cipher.decrypt({
    jwe,
    keyAgreementKey: await X25519KeyPair.from({
      id: 'did:example:123#key-0',
      type: 'JsonWebKey2020',
      controller: 'did:example:123',
      publicKeyJwk,
      privateKeyJwk,
    }),
  });
  expect(JSON.parse(Buffer.from(plaintext).toString('utf-8'))).toEqual(message);
});
