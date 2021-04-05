/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
// map of future CBOR-LD codec registry of known CBOR-LD codecs

import {
  codecEncodeMap,
  termCodecs,
  // never used....
  // codecDecodeMap
} from '../registries/codecs';

export class CodecMapCodec {
  value: any;
  termCodecMap: any;
  constructor() {}

  set({ value, termCodecMap }: any) {
    this.value = value;
    this.termCodecMap = termCodecMap;
  }

  encodeCBOR(gen: any) {
    const encodedValue = new Map();

    // convert terms and codecs to small values
    for (const [key, value] of this.value.entries()) {
      encodedValue.set(
        this.termCodecMap.get(key).value,
        codecEncodeMap.get(value)
      );
    }

    return gen.pushAny(encodedValue);
  }

  decodeCBOR() {
    const decodedValue = new Map();

    this.value.forEach((value: any, key: any) =>
      decodedValue.set(key, termCodecs.get(value))
    );

    return decodedValue;
  }
}
