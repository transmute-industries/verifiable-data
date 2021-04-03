// orignally from https://github.com/digitalbazaar/cborld

import { inspect } from 'util';
// decodes a CBOR-LD decoding map
export const decodeMap = (decodingMap: Map<any, any>) => {
  const jsonldDocument: any = {};

  for (const [key, value] of decodingMap.entries()) {
    // set the encoded value
    let decodedValue = value;
    if (value instanceof Map) {
      decodedValue = decodeMap(value);
    } else if (Array.isArray(value)) {
      decodedValue = [];
      value.forEach(element => {
        let decodedSubvalue = element;
        // FIXME: Repetitive code, doesn't work for arrays of arrays?
        if (value instanceof Map) {
          decodedSubvalue = decodeMap(element);
        } else if (element.decodeCBOR) {
          decodedSubvalue = element.decodeCBOR();
        } else {
          throw new Error(
            `Unknown encoding for '${key}' detected in CBOR-LD input: ` +
              `${inspect(element)}`
          );
        }
        decodedValue.push(decodedSubvalue);
      });
    } else if (value.decodeCBOR) {
      decodedValue = value.decodeCBOR();
    } else {
      throw new Error(
        `Unknown encoding for '${key}' detected in CBOR-LD input: ` +
          `${inspect(value)}`
      );
    }

    jsonldDocument[key] = decodedValue;
  }

  return jsonldDocument;
};
