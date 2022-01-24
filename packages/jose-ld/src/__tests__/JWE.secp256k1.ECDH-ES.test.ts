import {
  JsonWebKey2020,
  Secp256k1KeyPair,
} from '@transmute/secp256k1-key-pair';

import { JWE } from '../index';

import { crypto } from '../crypto';

let k: Secp256k1KeyPair;
let ks: JsonWebKey2020;

beforeAll(async () => {
  k = await Secp256k1KeyPair.generate({
    secureRandom: () => {
      return crypto.getRandomValues(new Uint8Array(32));
    },
  });

  ks = (await k.export({
    type: 'JsonWebKey2020',
    privateKey: false,
  })) as JsonWebKey2020;
});

// unsupported at this time.
describe.skip(`ECDH-ES`, () => {
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
