# @transmute/ed25519-signature-2018

```
npm i @transmute/ed25519-signature-2018 --save
```

- [Read the Spec](https://w3c-ccg.github.io/lds-ed25519-2018/)

## Usage

## With JsonWebKey2020

```ts
import { Ed25519Signature2018, Ed25519KeyPair } from "..";
const vcjs = require("vc-js");
const key = await Ed25519KeyPair.from({
  id:
    "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC#z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
  type: "JsonWebKey2020",
  controller: "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
  publicKeyJwk: {
    crv: "Ed25519",
    x: "04lCXD05RnZQD2JBsgcu23YmTeiQHoMgyRtpenSCwBk",
    kty: "OKP",
  },
  privateKeyJwk: {
    crv: "Ed25519",
    d: "xyaCV-He8UnZI-BWIfz2R98tlu_LbM0C08WxAXbjoG8",
    x: "04lCXD05RnZQD2JBsgcu23YmTeiQHoMgyRtpenSCwBk",
    kty: "OKP",
  },
});
const vc = await vcjs.issue({
  credential: {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: "https://example.com/credentials/123",
    type: ["VerifiableCredential"],
    issuer: "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
    issuanceDate: "2019-12-03T12:19:52Z",
    credentialSubject: {
      id: "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
    },
  },
  suite: new Ed25519Signature2018({
    key,
  }),
  documentLoader,
});

expect(vc.proof.type).toBe("Ed25519Signature2018");

const verification = await vcjs.verifyCredential({
  credential: vc,
  suite: new Ed25519Signature2018({}),
  documentLoader: (iri: string) => {
    if (iri.startsWith("did:key:z6Mkth1Tmxa")) {
      return {
        documentUrl: iri,
        document: {
          "@context": ["https://www.w3.org/ns/did/v1"],
          id: "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
          assertionMethod: [
            {
              id: "#z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
              type: "JsonWebKey2020",
              controller:
                "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
              publicKeyJwk: {
                crv: "Ed25519",
                x: "04lCXD05RnZQD2JBsgcu23YmTeiQHoMgyRtpenSCwBk",
                kty: "OKP",
              },
            },
          ],
        },
      };
    }
    return documentLoader(iri);
  },
});
expect(verification.verified).toBe(true);
```

### With Ed25519VerificationKey2018

```ts
const key = await Ed25519KeyPair.from({
  id:
    "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC#z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
  type: "Ed25519VerificationKey2018",
  controller: "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
  publicKeyBase58: "FEkRBiL3GfrG2m1yh5mrxds8vTkRwYzwgBKWSH33J64p",
  privateKeyBase58:
    "4ywHegJBWnGAu3ZTtMX3Jtu1XUMtJJdmzEoqMk8RS2Fkv5W9hnJpyooY5qNFBTWEPHT5uSjakt2rJodp4DundZvg",
});
const vc = await vcjs.issue({
  credential: {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: "https://example.com/credentials/123",
    type: ["VerifiableCredential"],
    issuer: "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
    issuanceDate: "2019-12-03T12:19:52Z",
    credentialSubject: {
      id: "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
    },
  },
  suite: new Ed25519Signature2018({
    key,
  }),
  documentLoader,
});

expect(vc.proof.type).toBe("Ed25519Signature2018");

const verification = await vcjs.verifyCredential({
  credential: vc,
  suite: new Ed25519Signature2018({}),
  documentLoader: (iri: string) => {
    if (iri.startsWith("did:key:z6Mkth1Tmxa")) {
      return {
        documentUrl: iri,
        document: {
          "@context": ["https://www.w3.org/ns/did/v1"],
          id: "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
          assertionMethod: [
            {
              id: "#z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
              type: "Ed25519VerificationKey2018",
              controller:
                "did:key:z6Mkth1TmxaUcDLj9FrgNejhojR8k32HMSFJNCESGZ14DJrC",
              publicKeyBase58: "FEkRBiL3GfrG2m1yh5mrxds8vTkRwYzwgBKWSH33J64p",
            },
          ],
        },
      };
    }
    return documentLoader(iri);
  },
});
expect(verification.verified).toBe(true);
```

## About

This typescript module has been built to support direct substitutability with [digitalbazaar/jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures/blob/master/lib/suites/Ed25519Signature2018.js) for Linked Data Proofs.

However, some changes were made to support typescript, and no `defaultDocumentLoader` is provided.
