/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */

import * as jose from 'jose';
import { enc } from './alg';
export class DecryptTransformer {
  public keyAgreementKey: any;

  constructor({ keyAgreementKey }: any = {}) {
    if (!keyAgreementKey) {
      throw new TypeError('"keyAgreementKey" is a required parameter.');
    }

    this.keyAgreementKey = keyAgreementKey;
  }

  async transform(chunk: any, controller: any) {
    // assumes `chunk` is an object with a JWE under the `jwe` property
    if (!(chunk && typeof chunk === 'object')) {
      throw new TypeError('"chunk" must be an object.');
    }
    const { jwe } = chunk;

    const data = await this.decrypt(jwe);
    if (data === null) {
      const error = new Error('Invalid decryption key.');
      error.name = 'DataError';
      throw error;
    }

    controller.enqueue(data);
  }

  async decrypt(jwe: any) {
    // validate JWE
    if (!(jwe && typeof jwe === 'object')) {
      throw new TypeError('"jwe" must be an object.');
    }
    if (typeof jwe.protected !== 'string') {
      throw new TypeError('"jwe.protected" is missing or not a string.');
    }
    if (typeof jwe.iv !== 'string') {
      throw new Error('Invalid or missing "iv".');
    }
    if (typeof jwe.ciphertext !== 'string') {
      throw new Error('Invalid or missing "ciphertext".');
    }
    if (typeof jwe.tag !== 'string') {
      throw new Error('Invalid or missing "tag".');
    }
    // validate encryption header
    let header;
    try {
      // ASCII(BASE64URL(UTF8(JWE Protected Header)))
      header = JSON.parse(Buffer.from(jwe.protected, 'base64').toString());
    } catch (e) {
      throw new Error('Invalid JWE "protected" header.');
    }
    if (!(header.enc && typeof header.enc === 'string')) {
      throw new Error('Invalid JWE "enc" header.');
    }
    if (header.enc !== enc) {
      throw new Error(`Unsupported encryption algorithm "${header.enc}".`);
    }
    if (!Array.isArray(jwe.recipients)) {
      throw new TypeError('"jwe.recipients" must be an array.');
    }

    const { privateKeyJwk } = await this.keyAgreementKey.export({
      type: 'JsonWebKey2020',
      privateKey: true,
    });
    const decrypted = await jose.generalDecrypt(
      jwe,
      await jose.importJWK(privateKeyJwk, 'ECDH-ES+A256KW')
    );
    return decrypted.plaintext;
  }
}
