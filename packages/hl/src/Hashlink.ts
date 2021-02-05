import * as cbor from 'borc';
import { TextDecoder, stringToUint8Array } from './util';

import { EncodeHashlinkOptions, VerifyHashlinkOptions } from './types';

export class Hashlink {
  public registeredCodecs: any;

  constructor() {
    this.registeredCodecs = {};
  }

  async encode({ data, urls, codecs, meta = {} }: EncodeHashlinkOptions) {
    // ensure data or urls are provided
    if (data === undefined && urls === undefined) {
      throw new Error('Either `data` or `urls` must be provided.');
    }

    // ensure codecs are provided
    if (codecs === undefined) {
      throw new Error('The hashlink creation `codecs` must be provided.');
    }

    if (urls !== undefined) {
      // ensure urls are an array
      if (!Array.isArray(urls)) {
        urls = [urls];
      }

      // ensure all URLs are strings
      urls.forEach((url: string) => {
        if (typeof url !== 'string') {
          throw new Error(`URL "${url}" must be a string.`);
        }
      });

      // merge meta options with urls
      meta = { ...meta, url: urls };
    }

    // generate the encoded cryptographic hash
    const outputData = await (codecs as any).reduce(
      async (output: any, codec: any) => {
        const encoder = this.registeredCodecs[codec];
        if (encoder === undefined) {
          throw new Error(`Unknown cryptographic hash encoder "${encoder}".`);
        }

        return encoder.encode(await output);
      },
      data
    );

    // generate the encoded metadata
    const metadata = new Map();
    if (meta.url) {
      metadata.set(0x0f, meta.url);
    }
    if (meta['content-type']) {
      metadata.set(0x0e, meta['content-type']);
    }
    if (meta.experimental) {
      metadata.set(0x0d, meta.experimental);
    }
    if (meta.transform) {
      metadata.set(0x0c, meta.transform);
    }

    const textDecoder = new TextDecoder();
    let hashlink = 'hl:' + textDecoder.decode(outputData);

    if (metadata.size > 0) {
      const baseEncodingCodec = codecs[codecs.length - 1];
      const cborData = new Uint8Array(cbor.encode(metadata));
      const mbCborData = textDecoder.decode(
        this.registeredCodecs[baseEncodingCodec].encode(cborData)
      );
      hashlink += ':' + mbCborData;
    }

    return hashlink;
  }

  decode() {
    throw new Error('Not implemented.');
  }

  async verify({ data, hashlink }: VerifyHashlinkOptions) {
    const components = hashlink.split(':');

    if (components.length > 3) {
      throw new Error(
        `Hashlink "${hashlink}" is invalid; ` +
          'it contains more than two colons.'
      );
    }

    // determine the base encoding decoder and decode the multihash value
    const multibaseEncodedMultihash = stringToUint8Array(components[1]);
    const multibaseDecoder: any = this._findDecoder(multibaseEncodedMultihash);
    const encodedMultihash = multibaseDecoder.decode(multibaseEncodedMultihash);

    // determine the multihash decoder
    const multihashDecoder: any = this._findDecoder(encodedMultihash);

    // extract the metadata to discover extra codecs
    const codecs = [];
    if (components.length === 3) {
      const encodedMeta = stringToUint8Array(components[2]);
      const cborMeta = multibaseDecoder.decode(encodedMeta);
      const meta = cbor.decode(cborMeta);
      // extract transforms if they exist
      if (meta.has(0x0c)) {
        codecs.push(...meta.get(0x0c));
      }
    }

    // generate the complete list of codecs
    codecs.push(multihashDecoder.algorithm, multibaseDecoder.algorithm);

    // generate the hashlink
    const generatedHashlink = await this.encode({ data, codecs });
    const generatedComponents = generatedHashlink.split(':');

    // check to see if the encoded hashes match
    return components[1] === generatedComponents[1];
  }

  use(codec: any) {
    this.registeredCodecs[codec.algorithm] = codec;
  }

  _findDecoder(bytes: any) {
    const decoders = Object.values(this.registeredCodecs);
    const decoder: any = decoders.find((decoder: any) =>
      decoder.identifier.every((id: any, i: any) => id === bytes[i])
    );
    if (!decoder) {
      throw new Error('Could not determine decoder for: ' + bytes);
    }
    return decoder;
  }
}
