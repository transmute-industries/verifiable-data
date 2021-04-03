// orignally from https://github.com/digitalbazaar/cborld

import { inspect } from 'util';
import * as CBOR from 'cbor-web';
import { getCborLdContexts } from './getCborLdContexts';
import { getTermCodecMap } from './getTermCodecMap';
import { generateDecodingMap } from './generateDecodingMap';
import { decodeMap } from './decodeMap';

export const decode = async (
  document: Uint8Array,
  documentLoader: any,
  options: any = {}
) => {
  const cborMap = CBOR.decode(document);
  // normalize value to a Map
  if (!(cborMap.value instanceof Map)) {
    cborMap.value = new Map(Object.entries(cborMap.value));
  }

  let decodedDocument: any = {};

  if (cborMap.tag === 0x0500) {
    decodedDocument = cborMap.value;
  } else if (cborMap.tag === 0x0501) {
    const contextUrls = getCborLdContexts({
      cborMap: cborMap.value,
      // appContextMap,
    });
    const appTermMap = cborMap.value.get(0);
    cborMap.value.delete(0);
    const termCodecMap = await getTermCodecMap({
      contextUrls,
      appTermMap,
      documentLoader,
      decode: true,
    });

    // generate the decoding Map from the CBOR map
    const decodingMap = generateDecodingMap({
      cborMap: cborMap.value,
      // appContextMap,
      appTermMap,
      termCodecMap,
    });

    decodedDocument = decodeMap(decodingMap);
  } else {
    throw new Error(
      'Input is not valid CBOR-LD; missing CBOR-LD header (0x0500 or 0x501).'
    );
  }

  if (options.diagnose) {
    options.diagnose(inspect(decodedDocument, { depth: null, colors: true }));
  }
  return decodedDocument;
};
