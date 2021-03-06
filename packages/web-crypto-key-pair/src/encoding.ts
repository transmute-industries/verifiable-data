export const base64 = {
  encode: (unencoded: any) => {
    return Buffer.from(unencoded || '').toString('base64');
  },
  decode: (encoded: any) => {
    return Buffer.from(encoded || '', 'base64').toString('utf8');
  },
};

export const base64url = {
  encode: (unencoded: any) => {
    var encoded = base64.encode(unencoded);
    return encoded
      .replace('+', '-')
      .replace('/', '_')
      .replace(/=+$/, '');
  },
  decode: (encoded: any) => {
    encoded = encoded.replace('-', '+').replace('_', '/');
    while (encoded.length % 4) encoded += '=';
    return base64.decode(encoded);
  },
};
