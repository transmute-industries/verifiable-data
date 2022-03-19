// const k = await WebCryptoKey.generate({
//   kty: "EC",
//   crvOrSize: "P-256",
// });
// const jsonWebKey = await k.export({
//   type: "JsonWebKey2020",
//   privateKey: true,
// });
export const jsonWebKey = {
  id: 'did:key:zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc#zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc',
  type: 'JsonWebKey2020',
  controller: 'did:key:zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-256',
    x: 'K2Hu1HMRBpalJuqpjIyJWY1BhcPwaPoyfjhyAB6ZyqU',
    y: 'SFdiOkC4PcxDLGGatqkKmlVtSYVdhPYMWjyJEmQQqxQ',
  },
  privateKeyJwk: {
    kty: 'EC',
    crv: 'P-256',
    d: 'qsNrVHJIT4WLcRfdGqrdKWFp1aSEnNZXDFOLKRi1K1w',
    x: 'K2Hu1HMRBpalJuqpjIyJWY1BhcPwaPoyfjhyAB6ZyqU',
    y: 'SFdiOkC4PcxDLGGatqkKmlVtSYVdhPYMWjyJEmQQqxQ',
  },
};
