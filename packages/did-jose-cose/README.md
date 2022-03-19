### @transmute/did-jose-cose

🚧 This package is experimental.

```
npm i @transmute/did-jose-cose --save
```

Learn more about [Verifable Data](https://github.com/transmute-industries/verifiable-data).

## Usage

### JWT - JSON Web Tokens

```ts
import { jose } from "@transmute/did-jose-cose";
import { jsonWebKey, documentLoader } from "../../../__fixtures__";
it("JWT sign and verify", async () => {
  const { id, privateKeyJwk } = jsonWebKey;
  const header = { kid: id };
  const payload = {
    iss: "coap://as.example.com",
    sub: "erikw",
    aud: "coap://light.example.com",
    exp: 2444064944,
    nbf: 1443944944,
    iat: 1443944944,
    jti: "0b71",
  };
  const jwt = await jose.jwt.sign(header, payload, privateKeyJwk);
  const v = await jose.jwt.verify(jwt, id, documentLoader);
  expect(v.verified).toBe(true);
});
```

### CWT - CBOR Web Tokens

```ts
import { cose } from "@transmute/did-jose-cose";
import { jsonWebKey, documentLoader } from "../../../__fixtures__";
it("CWT sign and verify", async () => {
  const { id, privateKeyJwk } = jsonWebKey;
  const header = { kid: id };
  const payload = {
    iss: "coap://as.example.com",
    sub: "erikw",
    aud: "coap://light.example.com",
    exp: 1444064944,
    nbf: 1443944944,
    iat: 1443944944,
    cti: "0b71",
  };
  const cwt = await cose.cwt.sign(header, payload, privateKeyJwk);
  const v = await cose.cwt.verify(cwt, id, documentLoader);
  expect(v.verified).toBe(true);
});
```

#### What is a documentLoader?

A document loader helps dereference DID URLs, like:

- `did:example:123#key-0`.
- `did:key:zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc#zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc`

Transformaing these DID URLs into json documents that contain a `publicKeyJwk` property.

This key can then be used to verify JWT and CWTs.

```ts
import { resolve } from "@transmute/did-key-web-crypto";
import {
  documentLoaderFactory,
  DidUrl,
  didUrlToDid,
} from "@transmute/jsonld-document-loader";

export const documentLoader = documentLoaderFactory.build({
  ["did:key"]: async (didUrl: DidUrl) => {
    const did = didUrlToDid(didUrl);
    const { didDocument } = await resolve(did, {
      accept: "application/did+json",
    });
    // although this function returns a "DID Document"
    // The documentLoader internals find the correct "sub resource"
    // If the original DID URL contained a fragment.
    return didDocument;
  },
});
```

#### What is a JsonWebKey?

It's a json object with an `id` that becomes a `kid`.

In the case of a verification key, it contains a `publicKeyJwk` property.

In the case of a signing key, it also contains `privateKeyJwk`.

Be careful with private keys.

```ts
import { WebCryptoKey } from "@transmute/did-key-web-crypto";
const k = await WebCryptoKey.generate({
  kty: "EC",
  crvOrSize: "P-256",
});
const jsonWebKey = await k.export({
  type: "JsonWebKey2020",
  privateKey: true,
});
// export const jsonWebKey = {
//   id: "did:key:zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc#zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc",
//   type: "JsonWebKey2020",
//   controller: "did:key:zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc",
//   publicKeyJwk: {
//     kty: "EC",
//     crv: "P-256",
//     x: "K2Hu1HMRBpalJuqpjIyJWY1BhcPwaPoyfjhyAB6ZyqU",
//     y: "SFdiOkC4PcxDLGGatqkKmlVtSYVdhPYMWjyJEmQQqxQ",
//   },
//   privateKeyJwk: {
//     kty: "EC",
//     crv: "P-256",
//     d: "qsNrVHJIT4WLcRfdGqrdKWFp1aSEnNZXDFOLKRi1K1w",
//     x: "K2Hu1HMRBpalJuqpjIyJWY1BhcPwaPoyfjhyAB6ZyqU",
//     y: "SFdiOkC4PcxDLGGatqkKmlVtSYVdhPYMWjyJEmQQqxQ",
//   },
// };
```
