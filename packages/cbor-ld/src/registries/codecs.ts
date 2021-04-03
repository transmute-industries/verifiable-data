import { MultibaseCodec } from '../codecs/MultibaseCodec';
import { UrlCodec } from '../codecs/UrlCodec';
import { XsdDateTimeCodec } from '../codecs/XsdDateTimeCodec';
import { XsdDateCodec } from '../codecs/XsdDateCodec';

export const codecEncodeMap = new Map();
export const codecDecodeMap = new Map();
export const termCodecs = new Map();

const registry = [
  [1, 'url', UrlCodec],
  [2, 'multibase', MultibaseCodec],
  [3, 'dateTime', XsdDateTimeCodec],
  [4, 'date', XsdDateCodec],
];

for (const [id, value, codec] of registry) {
  codecEncodeMap.set(value, id);
  codecDecodeMap.set(id, value);
  termCodecs.set(value, codec);
  termCodecs.set(id, codec);
}
