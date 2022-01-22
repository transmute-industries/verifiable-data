// originally based on https://github.com/digitalbazaar/minimal-cipher
// modified to support additional key types and representations.

import { base64url } from '../encoding';
import { TransformStream, stringToUint8Array } from './util';
import { DecryptTransformer } from './DecryptTransformer';
import { EncryptTransformer } from './EncryptTransformer';

// import * as cipher from './xc20p';
import * as cipher from './a256gcm';

import { crypto } from '../crypto';

import { kekFromStaticPeer } from './kekFromStaticPeer';

export class Cipher {
  constructor(public KeyPairClass: any) {}

  async createEncryptStream({ recipients, publicKeyResolver, chunkSize }: any) {
    const transformer = await this.createEncryptTransformer({
      recipients,
      publicKeyResolver,
      chunkSize,
    });
    return new TransformStream(transformer);
  }

  async createDecryptStream({ keyAgreementKey }: any) {
    const transformer = await this.createDecryptTransformer({
      keyAgreementKey,
    });
    return new TransformStream(transformer);
  }

  async encrypt({ data, recipients, publicKeyResolver }: any) {
    if (!(data instanceof Uint8Array) && typeof data !== 'string') {
      throw new TypeError('"data" must be a Uint8Array or a string.');
    }
    if (data) {
      data = stringToUint8Array(data);
    }
    const transformer = await this.createEncryptTransformer({
      recipients,
      publicKeyResolver,
    });
    return transformer.encrypt(data);
  }

  async encryptObject({ obj, ...rest }: any) {
    if (typeof obj !== 'object') {
      throw new TypeError('"obj" must be an object.');
    }
    return this.encrypt({ data: JSON.stringify(obj), ...rest });
  }

  async decrypt({ jwe, keyAgreementKey }: any) {
    const transformer = await this.createDecryptTransformer({
      keyAgreementKey,
    });
    return transformer.decrypt(jwe);
  }

  async decryptObject({ jwe, keyAgreementKey }: any) {
    const data = await this.decrypt({ jwe, keyAgreementKey });
    if (!data) {
      // decryption failed
      return null;
    }

    return JSON.parse(Buffer.from(data).toString());
  }

  async createEncryptTransformer({
    recipients,
    publicKeyResolver,
    chunkSize,
  }: any) {
    if (!(Array.isArray(recipients) && recipients.length > 0)) {
      throw new TypeError('"recipients" must be a non-empty array.');
    }
    // ensure all recipients use the supported key agreement algorithm

    const alg = 'ECDH-ES+A256KW';
    if (!recipients.every(e => e.header && e.header.alg === alg)) {
      throw new Error(`All recipients must use the algorithm "${alg}".`);
    }
    // generate a CEK for encrypting the content
    const cek = await cipher.generateKey();

    // fetch all public DH keys
    const publicKeys = await Promise.all(
      recipients.map(e => publicKeyResolver(e.header.kid))
    );
    // derive ephemeral ECDH key pair to use with all recipients
    const epk = await (
      await this.KeyPairClass.generate({
        // TODO: we need extra arguemnts to handle EPK generation...
        // P-384 is the default.
        kty: 'EC',
        crvOrSize: 'P-384',
        secureRandom: () => {
          return crypto.getRandomValues(new Uint8Array(32));
        },
      })
    ).export({ type: 'JsonWebKey2020', privateKey: true });

    const ephemeralKeyPair = {
      keypair: epk,
      epk: epk.publicKeyJwk,
    };

    // derive KEKs for each recipient
    const derivedResults = await Promise.all(
      publicKeys.map(staticPublicKey =>
        kekFromStaticPeer(this.KeyPairClass)({
          ephemeralKeyPair,
          staticPublicKey,
        })
      )
    );

    // update all recipients with ephemeral ECDH key and wrapped CEK
    await Promise.all(
      recipients.map(async (recipient, i) => {
        const { kek, epk, apu, apv } = derivedResults[i];
        recipients[i] = recipient = { header: { ...recipient.header } };
        recipient.header.epk = epk;
        recipient.header.apu = apu;
        recipient.header.apv = apv;
        recipient.encrypted_key = await kek.wrapKey({ unwrappedKey: cek });
      })
    );

    // create shared protected header as associated authenticated data (aad)
    // ASCII(BASE64URL(UTF8(JWE Protected Header)))
    const enc = cipher.JWE_ENC;
    const jweProtectedHeader = JSON.stringify({ enc });
    const encodedProtectedHeader = base64url.encode(
      Buffer.from(stringToUint8Array(jweProtectedHeader))
    );
    // UTF8-encoding a base64url-encoded string is the same as ASCII
    const additionalData = stringToUint8Array(encodedProtectedHeader);

    return new EncryptTransformer({
      publicKeyResolver,
      recipients,
      encodedProtectedHeader,
      cipher,
      additionalData,
      cek,
      chunkSize,
    });
  }

  async createDecryptTransformer({ keyAgreementKey }: any) {
    return new DecryptTransformer({
      KeyPairClass: this.KeyPairClass,
      keyAgreementKey,
    });
  }
}
