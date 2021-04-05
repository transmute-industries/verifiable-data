/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {
  cborldContextEncodeMap,
  cborldContextDecodeMap,
} from '../registries/contexts';

export class ContextCodec {
  value: any;
  encodingMap: any;
  decodingMap: any;
  constructor() {}

  set({ value, appContextMap }: any) {
    this.value = value;
    this.encodingMap = new Map(cborldContextEncodeMap);
    this.decodingMap = new Map(cborldContextDecodeMap);

    // add the caller-defined context values
    if (appContextMap) {
      appContextMap.forEach((value: any, key: any) => {
        // caller-defined context values MUST be less than 32768
        // if the application-specific CBOR-LD encoded context URL values
        // are less than 0x8000, throw an error. The start of
        // application-specific context URL value space starts at 0x8000
        // if(value < 0x8000) {
        //   throw new CborldError(
        //     'ERR_INVALID_CBORLD_CONTEXT_VALUE',
        //     `The provided JSON-LD Context mapping from '${key}' to ` +
        //     `${value} (0x${value.toString(16)}) must be greater than ` +
        //     `32767 (0x7FFF).`
        //   );
        // }
        this.encodingMap.set(key, value);
        this.decodingMap.set(value, key);
      });
    }
  }

  encodeCBOR(gen: any) {
    let encodedValue = this.value;

    if (Array.isArray(this.value)) {
      encodedValue = this.value.map(element =>
        this.encodingMap.has(element) ? this.encodingMap.get(element) : element
      );
    } else if (typeof this.value === 'string') {
      encodedValue = this.encodingMap.has(this.value)
        ? this.encodingMap.get(this.value)
        : this.value;
    }

    return gen.pushAny(encodedValue);
  }

  decodeCBOR() {
    const decodedValue = Array.isArray(this.value)
      ? this.value.map(element => _decodeValue(this.decodingMap, element))
      : _decodeValue(this.decodingMap, this.value);

    return decodedValue;
  }
}

function _decodeValue(decodingMap: any, value: any) {
  let decodedValue = value;

  if (decodingMap.has(value)) {
    decodedValue = decodingMap.get(value);
  } else if (typeof value === 'string') {
    decodedValue = value;
  } else {
    throw new Error(
      `Unknown encoded JSON-LD Context '${value}' detected while decoding.`
    );
  }

  return decodedValue;
}
