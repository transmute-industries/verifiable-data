import { b58urlRegex, urlHeaders } from '../registries/iris';

import { base58 } from '../bases';

const _decode = (data: string) => {
  const decoded = base58.decode(data);
  return decoded;
};

export class Base58DidUrlCodec {
  encode(value: any) {
    // break the base58 DID URL into segments
    const matches: any[] = Array.from(value.matchAll(b58urlRegex));
    const match = matches[0];

    const header = match[1];
    const authority = match[2];
    const fragment = match[3];

    // encode the DID URL segments
    const encodedUrl = urlHeaders.has(header) ? urlHeaders.get(header) : header;
    const encodedDid = _decode(authority);

    const encodedFragment = fragment ? _decode(fragment) : undefined;

    // construct the encoded URL array
    const encodedValue = [encodedUrl, encodedDid];
    if (encodedFragment) {
      encodedValue.push(encodedFragment);
    }
    return encodedValue;
  }

  decode(value: any) {
    const [encodedHeader, encodedAuthority, encodedFragment] = value;

    const header = urlHeaders.get(encodedHeader);
    const authority = 'z' + base58.encode(Uint8Array.from(encodedAuthority));
    const fragment = encodedFragment
      ? 'z' + base58.encode(Uint8Array.from(encodedFragment))
      : undefined;
    const decodedValue = fragment
      ? `${header}:${authority}#${fragment}`
      : `${header}:${authority}`;

    return decodedValue;
  }
}
