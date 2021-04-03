/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import * as b58 from 'base58-universal';
import { parse, stringify } from 'uuid';

const urlHeaders = new Map();
const urlEncoders = new Array();
const urlDecoders = new Array();

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

// FIXME: This is all fairly terrible and sloppy, refactor
/******** Helper classes/functions to aid with _encodeUrl *****************/

// URL prefix encode/decode map
urlHeaders.set('http://', 1);
urlHeaders.set(1, 'http://');
urlHeaders.set('https://', 2);
urlHeaders.set(2, 'https://');
urlHeaders.set('urn:uuid', 3);
urlHeaders.set(3, 'urn:uuid');
urlHeaders.set('did:v1:nym', 1024);
urlHeaders.set(1024, 'did:v1:nym');
urlHeaders.set('did:key', 1025);
urlHeaders.set(1025, 'did:key');

// Base58 DID URL encoding/decoding class
const b58urlRegex = /(did:.*)?:z([1-9A-HJ-NP-Za-km-z]+)?#{0,1}z{0,1}([1-9A-HJ-NP-Za-km-z]+)?/g;

export class Base58DidUrlCodec {
  encode(value: any) {
    // break the base58 DID URL into segments
    const matches: any[] = Array.from(value.matchAll(b58urlRegex));
    const match = matches[0];

    // encode the DID URL segments
    const encodedUrl = urlHeaders.has(match[1])
      ? urlHeaders.get(match[1])
      : match[1];
    const encodedDid = b58.decode(match[2]);
    const encodedFragment = match[3] ? b58.decode(match[3]) : undefined;

    // construct the encoded URL array
    const encodedValue = [encodedUrl, encodedDid];
    if (encodedFragment) {
      encodedValue.push(encodedFragment);
    }
    return encodedValue;
  }

  decode(value: any) {
    const [encodedHeader, encodedAuthority, encodedFragment] = value;

    const header = urlHeaders.get(encodedHeader);
    const authority = 'z' + b58.encode(Uint8Array.from(encodedAuthority));
    const fragment = encodedFragment
      ? 'z' + b58.encode(Uint8Array.from(encodedFragment))
      : undefined;
    const decodedValue = fragment
      ? `${header}:${authority}#${fragment}`
      : `${header}:${authority}`;

    return decodedValue;
  }
}

export class UrnUuidCodec {
  encode(value: any) {
    if (!value.startsWith('urn:uuid:')) {
      throw new Error('Invalid value, does not start with "urn:uuid".');
    }

    const rest = value.replace('urn:uuid:', '');

    if (rest !== rest.toLowerCase()) {
      return value;
    }

    // encode the DID URL segments
    const encodedUrl = urlHeaders.get('urn:uuid') || 'urn:uuid';
    const encodedUuid = parse(rest);

    // construct the encoded URL array
    const encodedValue = [encodedUrl, encodedUuid];

    return encodedValue;
  }

  decode(value: any) {
    const [encodedHeader, encodedUuid] = value;

    const header = urlHeaders.get(encodedHeader);
    const uuidValue = stringify(Uint8Array.from(encodedUuid));
    const decodedValue = `${header}:${uuidValue}`;

    return decodedValue;
  }
}

// URL prefix detection to map prefix to encoding/decoding class
// FIXME: urlEncoders and urlDecoders need to be refactored
urlEncoders.push([/urn:uuid/, UrnUuidCodec]);
urlEncoders.push([/did:v1:nym:z/, Base58DidUrlCodec]);
urlEncoders.push([/did:key:z/, Base58DidUrlCodec]);

urlDecoders.push([3, UrnUuidCodec]);
urlDecoders.push([1024, Base58DidUrlCodec]);
urlDecoders.push([1025, Base58DidUrlCodec]);

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
