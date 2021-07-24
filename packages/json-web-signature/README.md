### @transmute/json-web-signature

```
npm i @transmute/json-web-signature@latest --save
```

```ts
import { JsonWebKey, JsonWebSignature } from '@transmute/json-web-signature';
import { documentLoader } from 'path/somewhere';
import { verifiable } from '@transmute/vc.js';
const key = await JsonWebKey.from({
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

const result = await verifiable.credential.create({
  credential: {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/jws-2020/v1',
    ],
    id: 'https://example.com/credentials/123',
    issuer: key.controller,
    issuanceDate: '2000-03-10T04:24:12.164Z',
    type: ['VerifiableCredential'],
    credentialSubject: {
      id: `https://example.com/example/123`,
    },
  },
  format: ['vc'],
  documentLoader: documentLoader,
  suite,
});

const didDoc = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/suites/jws-2020/v1',
  ],
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

const result2 = await verifiable.credential.verify({
  credential: result.items[0],
  format: ['vc'],
  //   make sure to use a document loader
  //   that supports:
  //   https://www.w3.org/ns/did/v1
  //   https://www.w3.org/2018/credentials/v1
  //   https://w3id.org/security/suites/jws-2020/v1,
  documentLoader: async (iri: string) => {
    if (iri.startsWith(key.controller)) {
      return {
        documentUrl: iri,
        document: didDoc,
      };
    }
    return documentLoader(iri);
  },
  suite: [new JsonWebSignature()],
});
```
