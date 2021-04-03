/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import { Base64 } from 'js-base64';
import * as b58 from 'base58-universal';

export class MultibaseCodec {
  value: any;
  constructor() {}

  set({ value }: any) {
    this.value = value;
  }

  encodeCBOR(gen: any) {
    const encoding = this.value[0];
    let encodedValue = this.value;
    if (encoding === 'z') {
      // 0x7a === 'z' (multibase code for base58btc)
      encodedValue = new Uint8Array([
        0x7a,
        ...b58.decode(this.value.substring(1)),
      ]);
    } else if (encoding === 'M') {
      // 0x4d === 'M' (multibase code for base64pad)
      encodedValue = new Uint8Array([
        0x4d,
        ...Base64.toUint8Array(this.value.substring(1)),
      ]);
    }

    return gen.pushAny(encodedValue);
  }

  decodeCBOR() {
    const encoding = this.value[0];
    let decodedValue = this.value;

    if (encoding === 0x7a) {
      // 0x7a === 'z' (multibase code for base58btc)
      decodedValue = 'z' + b58.encode(this.value.slice(1));
    } else if (encoding === 'M') {
      // 0x4d === 'M' (multibase code for base64pad)
      decodedValue = 'M' + Base64.fromUint8Array(this.value.slice(1));
    }

    return decodedValue;
  }
}
