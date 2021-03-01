### @transmute/vc-status-rl-2020

```
npm i @transmute/vc-status-rl-2020@latest --save
```

## Usage

### Create a Verifiable Credential Revocation List Status

```ts
import { ld as vc } from '@transmute/vc.js';
import { createList, createCredential } from '@transmute/vc-status-rl-2020';
const id = 'https://example.com/status/2';
const list = await createList({ length: 100000 });
const verifiableCredentialStatusList = await vc.issue({
  credential: {
    ...(await createCredential({ id, list })),
    issuer: suite.key.controller,
    issuanceDate: '2021-03-01T01:16:12.860Z',
  },
  suite,
  documentLoader,
});
```

### Issue a Verifiable Credential with Revocation Status

```ts
const verifiableCredentialWithRevocationStatus = await vc.issue({
  credential: {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/vc-revocation-list-2020/v1',
    ],
    id: 'https://example.com/credenials/123',
    type: ['VerifiableCredential'],
    issuer: 'did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4',
    issuanceDate: '2021-03-01T01:16:12.860Z',
    credentialStatus: {
      id: 'https://example.com/status/2#0',
      type: 'RevocationList2020Status',
      revocationListIndex: '0',
      revocationListCredential: 'https://example.com/status/2',
    },
    credentialSubject: {
      id: 'did:example:123',
    },
  },
  suite,
  documentLoader,
});
```

### Revoke a Verifiable Credential with Revocation Status

```ts
import { ld as vc } from '@transmute/vc.js';
import { decodeList, createCredential } from '@transmute/vc-status-rl-2020';

const list = await decodeList(signedRevocationList2020.credentialSubject);
list.setRevoked(0, true); // set the status of an exiting credential to revoked.
const verifiableCredentialStatusList = await vc.issue({
  credential: {
    ...(await createCredential({
      id: signedRevocationList2020.id,
      list,
    })),
    issuer: suite.key.controller,
    issuanceDate: '2021-03-01T01:16:12.860Z',
  },
  suite,
  documentLoader,
});
// make sure to publish the updated list at the expected location,
// for example: https://example.com/status/2
```

## About

This module is based on / interoperable with [digitalbazaar/vc-revocation-list](https://github.com/digitalbazaar/vc-revocation-list).
