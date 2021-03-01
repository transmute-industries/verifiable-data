import { Bitstring } from '@transmute/compressable-bitstring';

export class RevocationList2020 {
  bitstring: any;
  length: any;
  constructor({
    length,
    buffer,
  }: { length?: number; buffer?: Uint8Array } = {}) {
    this.bitstring = new Bitstring({ length, buffer });
    this.length = this.bitstring.length;
  }

  setRevoked(index: number, revoked: boolean) {
    if (typeof revoked !== 'boolean') {
      throw new TypeError('"revoked" must be a boolean.');
    }
    return this.bitstring.set(index, revoked);
  }

  isRevoked(index: number) {
    return this.bitstring.get(index);
  }

  async encode() {
    return this.bitstring.encodeBits();
  }

  static async decode({ encodedList }: { encodedList: string }) {
    const buffer = await Bitstring.decodeBits({ encoded: encodedList });
    return new RevocationList2020({ buffer });
  }
}
