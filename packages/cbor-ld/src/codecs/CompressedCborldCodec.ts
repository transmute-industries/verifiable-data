/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */

export class CompressedCborldCodec {
  tag: any;
  value: any;
  constructor() {
    // CBOR Tag 501 is 'Compressed CBOR-LD, Version 1'
    this.tag = 0x0501;
  }

  set({ value }: any) {
    this.value = value;
  }

  encodeCBOR(gen: any) {
    return gen._pushTag(this.tag) && gen.pushAny(this.value);
  }
}
