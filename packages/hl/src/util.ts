// Node.js TextDecoder/TextEncoder
import { TextDecoder, TextEncoder } from 'util';

const stringToUint8Array = (data: string | Uint8Array): Uint8Array => {
  if (typeof data === 'string') {
    // convert data to Uint8Array
    return new TextEncoder().encode(data);
  }
  if (!(data instanceof Uint8Array)) {
    throw new TypeError('"data" be a string or Uint8Array.');
  }
  return data;
};

export { TextDecoder, TextEncoder, stringToUint8Array };
