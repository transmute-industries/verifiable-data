/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
export class SimpleTypeCodec {
  value: any;
  constructor() {}

  set({ value }: any) {
    this.value = value;
  }

  encodeCBOR(gen: any) {
    return gen.pushAny(this.value);
  }

  decodeCBOR() {
    return this.value;
  }
}
