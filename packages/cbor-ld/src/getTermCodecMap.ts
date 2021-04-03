// orignally from https://github.com/digitalbazaar/cborld

import { generateTermEncodingMap } from './generateTermEncodingMap';

import { CodecMapCodec } from './codecs/CodecMapCodec';

export const getTermCodecMap = async ({
  contextUrls,
  appTermMap = new Map(),
  documentLoader,
  encode,
  decode,
}: any = {}) => {
  const termCodecMap = new Map();

  // ensure that either encode or decode is set
  if (encode === decode) {
    throw new Error(
      `Invalid encode/decode value set while building term codec map. ` +
        `encode: ${encode} decode: ${decode}`
    );
  }

  // retrieve all JSON-LD Contexts
  const contexts = await Promise.all(
    contextUrls.map(async (contextUrl: string) => {
      const doc = await documentLoader(contextUrl);
      if (typeof doc.document === 'string') {
        return JSON.parse(doc.document);
      }
      return doc.document;
    })
  );

  // generate a term codec map for each context
  contexts.forEach(context => {
    const map: any = generateTermEncodingMap(context);
    map.forEach((value: any, key: any) => termCodecMap.set(key, value));
  });

  // calculate the final values for the term codec map
  // FIXME: ensure this is the same in all locales; may need to
  // pick a particular locale to ensure it/do something else
  const terms = Array.from(termCodecMap.keys()).sort();
  terms.forEach((term, index) => {
    if (encode) {
      termCodecMap.get(term).value = index;
    } else if (decode) {
      termCodecMap.get(term).value = term;
      termCodecMap.set(index, termCodecMap.get(term));
    }
  });

  // overlay the app term map on the existing term encoding map
  if (decode && appTermMap.size > 0) {
    const codecMap = new CodecMapCodec();
    codecMap.set({ value: appTermMap, termCodecMap });
    appTermMap = codecMap.decodeCBOR();
  }

  // clear terms used during encoding
  // FIXME: This should be refactored when this function is refactored
  // ideally, we wouldn't need to delete old terms
  if (decode) {
    terms.forEach(term => termCodecMap.delete(term));
  }

  for (const [key, value] of appTermMap.entries()) {
    const codec = encode ? termCodecMap.get(value) : value;
    if (codec === undefined) {
      throw new Error(`Unknown codec '${value}' specified for term '${key}'.`);
    }
    termCodecMap.get(key).codec = codec;
  }

  return termCodecMap;
};
