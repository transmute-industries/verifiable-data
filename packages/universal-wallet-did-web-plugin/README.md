# @transmute/universal-wallet-did-web-plugin

```
npm i @transmute/universal-wallet-did-web-plugin --save
```

## Usage

```ts
import {
  factory,
  DidWebWallet,
} from '@transmute/universal-wallet-did-web-plugin';
import { representation } from '@did-core/did-ld-json';

const wallet: DidWebWallet = await factory
  .build()
  .generate('https://example.com/organizations/123/did.json');

const didDocument: Buffer = await wallet.didDocuments[
  'did:web:example.com:organizations:123'
].produce('application/did+ld+json');

// JSON.parse(didDocument.toString())
// JSON.stringify(
//   {
//     '@context': 'https://www.w3.org/ns/did/v1',
//     id: 'did:web:example.com:organizations:123',
//     verificationMethod: [
//       {
//         id: 'did:web:example.com:organizations:123#key-0',
//         type: 'JsonWebKey2020',
//         controller: 'did:web:example.com:organizations:123',
//         publicKeyJwk: {
//           crv: 'Ed25519',
//           x: '0Q0O6Dje52qY2lhB2WtXw2JxcHk2tfTiie6Pza2OKBA',
//           kty: 'OKP',
//         },
//       },
//       {
//         id: 'did:web:example.com:organizations:123#key-1',
//         type: 'JsonWebKey2020',
//         controller: 'did:web:example.com:organizations:123',
//         publicKeyJwk: {
//           kty: 'OKP',
//           crv: 'X25519',
//           x: '2Z5whTR_Hmt51gvJiPhA9JgMt23qyw0aAeQ3QtyTK1k',
//         },
//       },
//       {
//         id: 'did:web:example.com:organizations:123#key-2',
//         controller: 'did:web:example.com:organizations:123',
//         type: 'JsonWebKey2020',
//         publicKeyJwk: {
//           kty: 'EC',
//           crv: 'BLS12381_G1',
//           x: 'suynMfFrzUJICKPxtHqgKqHVPesRer9S-BKRebOBp0739gXskNeHN8rd2rqhyrLq',
//         },
//       },
//       {
//         id: 'did:web:example.com:organizations:123#key-3',
//         controller: 'did:web:example.com:organizations:123',
//         type: 'JsonWebKey2020',
//         publicKeyJwk: {
//           kty: 'EC',
//           crv: 'BLS12381_G2',
//           x:
//             'pNJAxOnYvK87UdbvcpHPkUhWo_c_Y7Ekt-TIxZJnJUZfV0Esnn8Wq8i30MhOV9NhDIMhySpdw89QwfTbr7rrs23fnvWBhG9h29yTVUnHDu_ZjSROEGUvcs7r0cBKUYHl',
//         },
//       },
//       {
//         id: 'did:web:example.com:organizations:123#key-4',
//         type: 'JsonWebKey2020',
//         controller: 'did:web:example.com:organizations:123',
//         publicKeyJwk: {
//           kty: 'EC',
//           crv: 'P-256',
//           x: '965feH0Y0yl5VEsMQ5j2xT41i8rG8QYU2fgOImMp5AQ',
//           y: 'oMyzQyA6KfwEr1HHotRFkGFJFOuKUOjUlRSW1UeaaOM',
//         },
//       },
//       {
//         id: 'did:web:example.com:organizations:123#key-5',
//         type: 'JsonWebKey2020',
//         controller: 'did:web:example.com:organizations:123',
//         publicKeyJwk: {
//           kty: 'EC',
//           crv: 'secp256k1',
//           x: 'EzHrWpz07f1Dme73g81HRPB0899qiukpOBgeOarXirA',
//           y: '5xnqUMoK1uzlKMWXce5EXwz8HVz2WRbC6M8gtgqensI',
//         },
//       },
//     ],
//     authentication: [
//       'did:web:example.com:organizations:123#key-0',
//       'did:web:example.com:organizations:123#key-4',
//       'did:web:example.com:organizations:123#key-5',
//     ],
//     assertionMethod: [
//       'did:web:example.com:organizations:123#key-1',
//       'did:web:example.com:organizations:123#key-4',
//     ],
//     capabilityInvocation: [
//       'did:web:example.com:organizations:123#key-0',
//       'did:web:example.com:organizations:123#key-4',
//     ],
//     capabilityDelegation: [
//       'did:web:example.com:organizations:123#key-0',
//       'did:web:example.com:organizations:123#key-4',
//     ],
//     keyAgreement: [
//       'did:web:example.com:organizations:123#key-1',
//       'did:web:example.com:organizations:123#key-4',
//     ],
//   },
//   null,
//   2
// );
```

## Getting Started

```
git clone git@github.com:w3c-ccg/universal-wallet-interop-spec.git
npm packages/did-web-plugin; // note that this is a mono repo
npm i
npm run lint
npm run test
npm run build
```
