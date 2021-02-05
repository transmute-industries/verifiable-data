import { blake2b } from 'blakejs';

export class MultihashBlake2b64 {
  public identifier: Uint8Array;
  public algorithm: string;

  constructor() {
    this.identifier = new Uint8Array([0xb2, 0x08, 0x08]);
    this.algorithm = 'mh-blake2b-64';
  }

  async encode(input: Uint8Array) {
    const blake2b64 = blake2b(input, null, 8);
    const mhblake2b64 = new Uint8Array(
      blake2b64.byteLength + this.identifier.byteLength
    );
    mhblake2b64.set(this.identifier, 0);
    mhblake2b64.set(blake2b64, this.identifier.byteLength);
    return mhblake2b64;
  }
}
