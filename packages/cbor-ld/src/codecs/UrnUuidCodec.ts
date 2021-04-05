import { parse, stringify } from 'uuid';

import { urlHeaders } from '../registries/iris';

export class UrnUuidCodec {
  encode(value: any) {
    if (!value.startsWith('urn:uuid:')) {
      throw new Error('Invalid value, does not start with "urn:uuid".');
    }

    const rest = value.replace('urn:uuid:', '');

    if (rest !== rest.toLowerCase()) {
      return value;
    }

    // encode the DID URL segments
    const encodedUrl = urlHeaders.get('urn:uuid') || 'urn:uuid';
    const encodedUuid = parse(rest);

    // construct the encoded URL array
    const encodedValue = [encodedUrl, encodedUuid];

    return encodedValue;
  }

  decode(value: any) {
    const [encodedHeader, encodedUuid] = value;

    const header = urlHeaders.get(encodedHeader);
    const uuidValue = stringify(Uint8Array.from(encodedUuid));
    const decodedValue = `${header}:${uuidValue}`;

    return decodedValue;
  }
}
