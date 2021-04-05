/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */

import { urlEncoders, urlDecoders } from '../registries/iris';

export class UrlCodec {
  constructor() {}
  value: any;
  termCodecMap: any;

  set({ value, termCodecMap }: any) {
    this.value = value;
    this.termCodecMap = termCodecMap;
  }

  encodeCBOR(gen: any) {
    let encodedValue = this.value;

    if (Array.isArray(this.value)) {
      encodedValue = this.value.map(element =>
        _encodeUrl(element, this.termCodecMap)
      );
    } else if (typeof this.value !== 'object') {
      encodedValue = _encodeUrl(this.value, this.termCodecMap);
    }

    return gen.pushAny(encodedValue);
  }

  decodeCBOR() {
    let decodedValue = this.value;

    // FIXME: Encoding URLs as an array is fragile, consider encoding URLs
    // as a CBOR map
    if (Array.isArray(this.value)) {
      const decoders = urlDecoders.filter(
        element => element[0] === this.value[0]
      );
      if (decoders.length === 1) {
        decodedValue = _decodeUrl(this.value, this.termCodecMap);
      } else {
        decodedValue = this.value.map(element =>
          _decodeUrl(element, this.termCodecMap)
        );
      }
    } else {
      decodedValue = _decodeUrl(this.value, this.termCodecMap);
    }

    return decodedValue;
  }
}

// encodes a URL given a term coding map
function _encodeUrl(url: any, termCodecMap: any) {
  // determine if a term value exists in the term coding map
  if (termCodecMap.get(url)) {
    return termCodecMap.get(url).value;
  }

  // search for a URL encoder and use it if one is found, otherwise just encode
  // the original URL
  let encodedValue = url;
  const encoders = urlEncoders.filter(element => url.match(element[0]));
  if (encoders.length === 1) {
    const codec = new encoders[0][1]();
    encodedValue = codec.encode(url);
  }

  return encodedValue;
}

// decode a URL given a term codec map
function _decodeUrl(encodedUrl: any, termCodecMap: any) {
  // determine if a value exists in the term coding map
  if (termCodecMap.get(encodedUrl)) {
    return termCodecMap.get(encodedUrl).value;
  }

  // search for a URL decoder and use it if one is found, otherwise just pass
  // the original encoded value
  let decodedValue = encodedUrl;
  const decoders = urlDecoders.filter(element => encodedUrl[0] === element[0]);
  if (decoders.length === 1) {
    const codec = new decoders[0][1]();
    decodedValue = codec.decode(encodedUrl);
  }

  return decodedValue;
}
