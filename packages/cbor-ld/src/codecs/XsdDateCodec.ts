/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
export class XsdDateCodec {
  value: any;
  constructor() {}

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
    if (this.value.indexOf('T') > 0) {
      throw new Error(
        'Invalid input, date includes time component \
  lost of precision expected'
      );
    }
    const encodedValue = Math.ceil(parsedDate.valueOf() / 1000);
    return gen.pushAny(encodedValue);
  }

  decodeCBOR() {
    const decodedValue = new Date(this.value * 1000);
    const dateString = decodedValue.toISOString();
    return dateString.substring(0, dateString.indexOf('T'));
  }
}
