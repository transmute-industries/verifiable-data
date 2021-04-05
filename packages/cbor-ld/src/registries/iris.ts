import { UrnUuidCodec } from '../codecs/UrnUuidCodec';
import { Base58DidUrlCodec } from '../codecs/Base58DidUrlCodec';

export const urlHeaders = new Map();
export const urlEncoders: any[] = [];
export const urlDecoders: any[] = [];

// Base58 DID URL encoding/decoding class
export const b58urlRegex = /(did:.*)?:z([1-9A-HJ-NP-Za-km-z]+)?#{0,1}z{0,1}([1-9A-HJ-NP-Za-km-z]+)?/g;

// URL prefix detection to map prefix to encoding/decoding class
// FIXME: urlEncoders and urlDecoders need to be refactored
urlEncoders.push([/urn:uuid/, UrnUuidCodec]);
urlEncoders.push([/did:v1:nym:z/, Base58DidUrlCodec]);
urlEncoders.push([/did:key:z/, Base58DidUrlCodec]);

urlDecoders.push([3, UrnUuidCodec]);
urlDecoders.push([1024, Base58DidUrlCodec]);
urlDecoders.push([1025, Base58DidUrlCodec]);

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
