// orignally from https://github.com/digitalbazaar/cborld

import { CodecMapCodec } from './codecs/CodecMapCodec';
import { ContextCodec } from './codecs/ContextCodec';
import { SimpleTypeCodec } from './codecs/SimpleTypeCodec';
import { MultibaseCodec } from './codecs/MultibaseCodec';
import { UrlCodec } from './codecs/UrlCodec';
import { XsdDateTimeCodec } from './codecs/XsdDateTimeCodec';
import { XsdDateCodec } from './codecs/XsdDateCodec';

export const generateTermEncodingMap = (context: any) => {
  const termCodecMap = new Map();

  // sanity check that context is a valid JSON-LD context object
  if (!context['@context']) {
    throw new Error(
      'The JSON-LD Context does not contain a top-level @context value: ' +
        JSON.stringify(context).substring(0, 100) +
        '...'
    );
  }

  // FIXME: Ensure that all JSON-LD keywords that could be keys are accounted
  // for in the map -- e.g., @id is currently missing
  termCodecMap.set('@codec', { codec: CodecMapCodec });
  termCodecMap.set('@context', { codec: ContextCodec });
  termCodecMap.set('@type', { codec: UrlCodec });

  for (const [key, value] of Object.entries(context['@context'])) {
    termCodecMap.set(key, { codec: SimpleTypeCodec });

    if (typeof value === 'string') {
      // if @id or @type has been aliased, ensure that the codec is a UrlCodec
      termCodecMap.get(key).codec = SimpleTypeCodec;
      if (value === '@type' || value === '@id') {
        termCodecMap.get(key).codec = UrlCodec;
      }
    } else if (typeof value === 'object') {
      // FIXME: Add support for global and local type-specific codecs
      let codec = SimpleTypeCodec;
      switch ((value as any)['@type']) {
        case '@id':
        case '@vocab':
          codec = UrlCodec;
          break;
        // FIXME: Keep track of prefixes and see if xsd matches
        // http://www.w3.org/2001/XMLSchema#
        case 'http://www.w3.org/2001/XMLSchema#':
        case 'xsd:dateTime':
          codec = XsdDateTimeCodec;
          break;
        case 'xsd:date':
          codec = XsdDateCodec;
          break;
        // FIXME: Expand all URLs so we don't have to also check against sec;
        // consider using jsonld.js to process context and get term definitions
        // for robustness
        case 'sec:multibase':
        case 'https://w3id.org/security#multibase':
          codec = MultibaseCodec;
          break;
      }
      termCodecMap.get(key).codec = codec;

      if ((value as any)['@context']) {
        const scopedTermEncodingMap: any = generateTermEncodingMap(value);
        scopedTermEncodingMap.forEach((value: any, key: any) =>
          termCodecMap.set(key, value)
        );
      }
    } else {
      termCodecMap.get(key).codec = SimpleTypeCodec;
    }
  }

  // FIXME: Merge caller-defined map

  return termCodecMap;
};
