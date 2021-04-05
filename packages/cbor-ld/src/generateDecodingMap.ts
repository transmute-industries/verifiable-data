// orignally from https://github.com/digitalbazaar/cborld
// generate a CBOR encoding map given a JSON-LD document and term codec map
// FIXME: This largely duplicates code from encode.js/_generateEncodingMap
export const generateDecodingMap = ({
  cborMap,
  appContextMap,
  termCodecMap,
}: any) => {
  const decodingMap = new Map();

  for (const [key, value] of cborMap.entries()) {
    // get the decoded term codec
    let term = key;
    if (termCodecMap) {
      const entry = termCodecMap.get(key);
      // check for undefined term codec keys
      if (entry === undefined) {
        throw new Error(`Unknown term '${key}' was detected in JSON-LD input.`);
      }
      term = entry.value;
    }

    // set the encoded value
    let decodedValue = value;
    if (value instanceof Map) {
      decodedValue = generateDecodingMap({
        cborMap: value,
        appContextMap,
        termCodecMap,
      });
    } else if (termCodecMap) {
      const Codec = termCodecMap.get(key).codec;
      decodedValue = new Codec();
      decodedValue.set({ value, appContextMap, termCodecMap });
    }

    decodingMap.set(term, decodedValue);
  }

  return decodingMap;
};
