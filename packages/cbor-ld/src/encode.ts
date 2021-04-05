// orignally from https://github.com/digitalbazaar/cborld

import { getJsonLdContexts } from './getJsonLdContexts';
import { inspect } from 'util';

import { getTermCodecMap } from './getTermCodecMap';
import { generateEncodingMap } from './generateEncodingMap';

import { CompressedCborldCodec } from './codecs/CompressedCborldCodec';
import { UncompressedCborldCodec } from './codecs/UncompressedCborldCodec';

import * as CBOR from 'cbor-web';
// import * as CBOR from '@digitalbazaar/cbor';

// const CBOR = require('cbor');

export const encode = async (
  document: object,
  documentLoader: any,
  options: any = {}
) => {
  const contexts = getJsonLdContexts(document);
  const termEncodingMap = await getTermCodecMap({
    contextUrls: contexts,
    documentLoader,
    encode: true,
  });

  const encodingMap = generateEncodingMap({
    jsonldDocument: document,
    // appContextMap,
    // appTermMap,
    termEncodingMap,
  });
  // console.log(encodingMap);
  // determine the appropriate codec
  const cborldObject = termEncodingMap
    ? new CompressedCborldCodec()
    : new UncompressedCborldCodec();

  cborldObject.set({ value: encodingMap });

  if (options.diagnose) {
    options.diagnose(inspect(cborldObject, { depth: null, colors: true }));
  }

  const encoded = CBOR.encode(cborldObject);

  // encode as CBOR
  const cborldBytes = Uint8Array.from(encoded);

  // See https://github.com/digitalbazaar/cborld/issues/32
  const hackAroundBug = Buffer.from(cborldBytes)
    .toString('hex')
    .replace(/d840/g, '');

  return Uint8Array.from(Buffer.from(hackAroundBug, 'hex'));
};
