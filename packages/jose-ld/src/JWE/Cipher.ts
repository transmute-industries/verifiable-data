// originally based on https://github.com/digitalbazaar/minimal-cipher
// modified to support additional key types and representations.

import { TransformStream, stringToUint8Array } from './util';
import { DecryptTransformer } from './DecryptTransformer';
import { EncryptTransformer } from './EncryptTransformer';
import { alg } from './alg';

export class Cipher {
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

    if (!recipients.every(e => e.header && e.header.alg === alg)) {
      throw new Error(`All recipients must use the algorithm "${alg}".`);
    }

    // update all recipients with ephemeral ECDH key and wrapped CEK
    await Promise.all(
      recipients.map(async (recipient, i) => {
        const publicKey = await publicKeyResolver(recipient.header.kid);
        recipients[i] = publicKey;
      })
    );

    return new EncryptTransformer({
      recipients,
      chunkSize,
    });
  }

  async createDecryptTransformer({ keyAgreementKey }: any) {
    return new DecryptTransformer({
      keyAgreementKey,
    });
  }
}
