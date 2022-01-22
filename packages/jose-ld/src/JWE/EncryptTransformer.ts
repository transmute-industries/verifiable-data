/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
// originally from https://github.com/digitalbazaar/minimal-cipher
// modified for agility
import * as jose from 'jose';

// 1 MiB = 1048576
const DEFAULT_CHUNK_SIZE = 1048576;

export class EncryptTransformer {
  public alg: string;
  public enc: string;
  public recipients: any;
  public chunkSize: any;
  public offset: any;
  public totalOffset: any;
  public index: any;
  public buffer: any;

  constructor({
    alg,
    enc,
    recipients,
    chunkSize = DEFAULT_CHUNK_SIZE,
  }: any = {}) {
    this.recipients = recipients; // type JsonWebKey2020[]
    this.chunkSize = chunkSize;
    this.offset = 0;
    this.totalOffset = 0;
    this.index = 0;
    this.alg = alg || 'ECDH-ES+A256KW';
    this.enc = enc || 'A256GCM';
  }

  start() {
    this.buffer = new Uint8Array(this.chunkSize);
  }

  async transform(chunk: any, controller: any) {
    const { buffer } = this;

    // assumes `chunk` is a Uint8Array...
    if (!(chunk instanceof Uint8Array)) {
      throw new TypeError('"chunk" must be an object.');
    }
    while (chunk) {
      const space = buffer.length - this.offset;
      if (chunk.length <= space) {
        buffer.set(chunk, this.offset);
        this.offset += chunk.byteLength;
        this.totalOffset += chunk.byteLength;
        chunk = null;
      } else {
        const partial = new Uint8Array(chunk.buffer, chunk.byteOffset, space);
        chunk = new Uint8Array(
          chunk.buffer,
          chunk.byteOffset + space,
          chunk.length - space
        );
        buffer.set(partial, this.offset);
        this.offset += space;
        this.totalOffset += space;
      }

      // flush if buffer is full and more data remains
      if (chunk) {
        await this.flush(controller);
      }
    }
  }

  async flush(controller: any) {
    if (this.offset === 0) {
      // nothing to flush
      return;
    }

    // encrypt data
    const { buffer } = this;
    const data = new Uint8Array(buffer.buffer, buffer.byteOffset, this.offset);
    const jwe = await this.encrypt(data);

    // clear buffer
    this.offset = 0;
    controller.enqueue({
      index: this.index++,
      offset: this.totalOffset,
      jwe,
    });
  }

  async encrypt(data: Uint8Array) {
    const { alg, enc } = this;
    const encryptor = new jose.GeneralEncrypt(data);
    await Promise.all(
      this.recipients.map(async (publicKey: any) => {
        return encryptor
          .addRecipient(await jose.importJWK(publicKey.publicKeyJwk, alg))
          .setUnprotectedHeader({ alg, kid: publicKey.id });
      })
    );
    encryptor.setProtectedHeader({ enc });
    const ciphertext = await encryptor.encrypt();
    return ciphertext as any;
  }
}
