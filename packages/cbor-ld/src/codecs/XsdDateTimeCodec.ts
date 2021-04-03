/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
export class XsdDateTimeCodec {
  constructor() {}
  value: any;

  set({ value }: any) {
    this.value = value;
  }

  encodeCBOR(gen: any) {
    if (typeof this.value !== 'string') {
      throw new Error('Invalid input, expected value to be of type string');
    }

    const parsedDate = Date.parse(this.value);

    if (isNaN(parsedDate)) {
      throw new Error('Invalid input, could not parse value as date');
    }
    if (this.value.indexOf('T') < 0) {
      throw new Error('Invalid input, date missing time component');
    }
    const encodedValue = Math.ceil(new Date(this.value).valueOf() / 1000);
    return gen.pushAny(encodedValue);
  }

  decodeCBOR() {
    const decodedValue = new Date(this.value * 1000);
    return decodedValue.toISOString().replace('.000Z', 'Z');
  }
}
