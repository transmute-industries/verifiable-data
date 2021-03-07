### @transmute/json-web-signature-2020

```
npm i @transmute/json-web-signature-2020@latest --save
```

```ts
import {
  KeyPair,
  JsonWebSignature,
  SUITE_CONTEXT_IRI,
} from '@transmute/json-web-signature-2020';

const key = await KeyPair.from({
  id: 'did:example:123#key',
  type: 'JsonWebKey2020',
  controller: 'did:example:123',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-384',
    x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
    y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
  },
  privateKeyJwk: {
    kty: 'EC',
    crv: 'P-384',
    x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
    y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
    d: 'Wq5_KgqjvYh_EGvBDYtSs_0ufJJP0y0tkAXl6GqxHMkY0QP8vmD76mniXD-BWhd_',
  },
});

suite = new JsonWebSignature({
  key,
});

const vc = await vcjs.issue({
  credential: {
    '@context': ['https://www.w3.org/2018/credentials/v1', SUITE_CONTEXT_IRI],
    id: 'https://example.com/credentials/123',
    issuer: key.controller,
    issuanceDate: '2000-03-10T04:24:12.164Z',
    type: ['VerifiableCredential'],
    credentialSubject: {
      id: `https://example.com/example/123`,
    },
  },
  suite,
  documentLoader,
});

const didDoc = {
  '@context': ['https://www.w3.org/ns/did/v1'],
  id: 'did:example:123',
  assertionMethod: [
    {
      id: 'did:example:123#key',
      type: 'JsonWebKey2020',
      controller: 'did:example:123',
      publicKeyJwk: {
        kty: 'EC',
        crv: 'P-384',
        x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
        y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
      },
    },
  ],
};

const verification = await vcjs.verifyCredential({
  credential: vc,
  suite,
  //   make sure to use a document loader
  //   that supports:
  //   (SUITE_CONTEXT_IRI) https://w3id.org/security/jws/v1
  //   (LINKED DATA PROOFS) https://w3id.org/security/v2
  //   (VC DATA MODEL) https://www.w3.org/2018/credentials/v1
  //   (DID CORE) https://www.w3.org/ns/did/v1
  documentLoader: async (iri: string) => {
    if (iri.startsWith(key.controller)) {
      return {
        documentUrl: iri,
        document: didDoc,
      };
    }
    return documentLoader(iri);
  },
});
```
