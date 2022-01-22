import { JsonWebKey2020, X25519KeyPair } from '@transmute/x25519-key-pair';

import { JWE } from '../index';

import { crypto } from '../crypto';

let k: X25519KeyPair;
let ks: JsonWebKey2020;

beforeAll(async () => {
  k = await X25519KeyPair.generate({
    secureRandom: () => {
      const seed = crypto.getRandomValues(new Uint8Array(32));
      return seed;
    },
  });

  ks = (await k.export({
    type: 'JsonWebKey2020',
    privateKey: false,
  })) as JsonWebKey2020;
});

describe(`ECDH-ES`, () => {
  it('encrypt / decrypt', async () => {
    const cipher = new JWE.Cipher();
    const document = { key1: 'value1', key2: 'value2' };
    const recipients = [
      {
        header: {
          kid: ks.id,
          alg: 'ECDH-ES+A256KW',
        },
      },
    ];
    const jwe = await cipher.encryptObject({
      obj: document,
      recipients,
      publicKeyResolver: async (id: string) => {
        if (id === ks.id) {
          return ks;
        }
        throw new Error(
          'publicKeyResolver does not suppport IRI ' + JSON.stringify(id)
        );
      },
    });
    expect(jwe.recipients[0].header.alg).toBe('ECDH-ES+A256KW');
    expect(jwe.recipients[0].header.kid).toBe(ks.id);
    const plaintext = await cipher.decrypt({ jwe, keyAgreementKey: k });
    expect(JSON.parse(Buffer.from(plaintext).toString('utf-8'))).toEqual(
      document
    );
  });
});
