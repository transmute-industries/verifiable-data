/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
export class UncompressedCborldCodec {
  tag: any;
  value: any;
  constructor() {
    // CBOR Tag 500 is 'Uncompressed CBOR-LD'
    this.tag = 0x0500;
  }

  set({ value }: any) {
    this.value = value;
  }

  encodeCBOR(gen: any) {
    return gen._pushTag(this.tag) && gen.pushAny(this.value);
  }
}
