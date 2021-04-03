// orignally from https://github.com/digitalbazaar/cborld

import { CodecMapCodec } from './codecs/CodecMapCodec';

export const generateEncodingMap = ({
  jsonldDocument,
  appContextMap,
  appTermMap,
  termEncodingMap,
}: any) => {
  const encodingMap = new Map();

  // add the appTermMap under @codec if it exists
  if (appTermMap && appTermMap.size > 0 && termEncodingMap) {
    const codecValue = new CodecMapCodec();
    codecValue.set({ value: appTermMap, termCodecMap: termEncodingMap });
    encodingMap.set(termEncodingMap.get('@codec').value, codecValue);
  }

  for (const [key, value] of Object.entries(jsonldDocument)) {
    // check for undefined term keys
    if (termEncodingMap && termEncodingMap.get(key) === undefined) {
      throw new Error(`Unknown term '${key}' was detected in JSON-LD input.`);
    }

    // get the encoded term
    const term = termEncodingMap ? termEncodingMap.get(key).value : key;

    // set the encoded value
    let encodedValue: any = value;
    if (typeof value === 'object' && (value as any).constructor === Object) {
      encodedValue = generateEncodingMap({
        jsonldDocument: value,
        appContextMap,
        termEncodingMap,
      });
    } else if (Array.isArray(value)) {
      encodedValue = [];
      value.forEach(element => {
        let encodedSubvalue = element;
        // FIXME: Repetitive code, doesn't work for arrays of arrays?
        if (typeof element === 'object' && element.constructor === Object) {
          encodedSubvalue = generateEncodingMap({
            jsonldDocument: element,
            appContextMap,
            termEncodingMap,
          });
        } else if (termEncodingMap) {
          const Codec = termEncodingMap.get(key).codec;
          encodedSubvalue = new Codec();
          encodedSubvalue.set({
            value: element,
            appContextMap,
            termCodecMap: termEncodingMap,
          });
        }
        encodedValue.push(encodedSubvalue);
      });
    } else if (termEncodingMap) {
      const Codec = termEncodingMap.get(key).codec;
      encodedValue = new Codec();
      encodedValue.set({ value, appContextMap, termCodecMap: termEncodingMap });
    }

    encodingMap.set(term, encodedValue);
  }

  return encodingMap;
};
