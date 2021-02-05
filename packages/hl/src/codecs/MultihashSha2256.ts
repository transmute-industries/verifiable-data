import crypto from '../crypto';

export class MultihashSha2256 {
  public identifier: Uint8Array;
  public algorithm: string;

  constructor() {
    this.identifier = new Uint8Array([0x12, 0x20]);
    this.algorithm = 'mh-sha2-256';
  }

  async encode(input: Uint8Array) {
    const sha2256 = new Uint8Array(
      await crypto.subtle.digest({ name: 'SHA-256' }, input)
    );
    const mhsha2256 = new Uint8Array(
      sha2256.byteLength + this.identifier.byteLength
    );

    mhsha2256.set(this.identifier, 0);
    mhsha2256.set(sha2256, this.identifier.byteLength);

    return mhsha2256;
  }
}
