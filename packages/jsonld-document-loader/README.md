### @transmute/jsonld-document-loader

```
npm i @transmute/jsonld-document-loader --save
```

Learn more about [Verifable Data](https://github.com/transmute-industries/verifiable-data).

## Usage

### With Static Context

```ts
import { documentLoaderFactory } from "@transmute/jsonld-document-loader";
const documentLoader = documentLoaderFactory.build({
  ["https://w3id.org/traceability/v1"]: {
    "@context": {
      "@version": 1.1,
      "@vocab": "https://w3id.org/traceability/#undefinedTerm",
      id: "@id",
      type: "@type",
      name: "https://schema.org/name",
      description: "https://schema.org/description",
      identifier: "https://schema.org/identifier",
      image: {
        "@id": "https://schema.org/image",
        "@type": "@id",
      },
    },
  },
});
const result = await documentLoader("https://w3id.org/traceability/v1");
// {
//   "document": {
//     "@context": {
//       "@version": 1.1,
//       "@vocab": "https://w3id.org/traceability/#undefinedTerm",
//       "id": "@id",
//       "type": "@type",
//       ...
//     }
//   }
// }
```

### With Dynamic Context

```ts
import axios from "axios";
import { documentLoaderFactory, Url } from "@transmute/jsonld-document-loader";
const documentLoader = documentLoaderFactory.build({
  ["https://w3id.org/rebase/v1"]: async (iri: Url) => {
    const { data } = await axios.get(iri);
    return data;
  },
});
const result = await documentLoader("https://w3id.org/rebase/v1");
// {
//   "document": {
//     "@context": {
//       "@version": 1.1,
//       "@vocab": "https://w3id.org/rebase#undefined-term",
//       "id": "@id",
//       "type": "@type",
//       ...
//     }
//   }
// }
```

### Resolve DID Document with remote did resolver

```ts
import axios from "axios";
import { documentLoaderFactory, Did } from "@transmute/jsonld-document-loader";
const documentLoader = documentLoaderFactory.build({
  ["did:key"]: async (did: Did) => {
    const endpoint = `https://api.did.actor/api/identifiers/${did}`;
    const { data } = await axios.get(endpoint);
    return data.didDocument;
  },
});
const result = await documentLoader(
  "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
);
// {
//   "document": {
//     "@context": [
//       "https://www.w3.org/ns/did/v1",
//       "https://w3id.org/security/suites/jws-2020/v1"
//     ],
//     "id": "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
//     "verificationMethod": [
//       {
//         "id": "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
//         "type": "JsonWebKey2020",
//         "controller": "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
//         "publicKeyJwk": {
//           "kty": "OKP",
//           "crv": "Ed25519",
//           "x": "0-e2i2_Ua1S5HbTYnVB0lj2Z2ytXu2-tYmDFf8f5NjU"
//         }
//       }
//      ...
//   }
// }
```

### DID Dereference without Context

```ts
import axios from "axios";
import {
  documentLoaderFactory,
  DidUrl,
} from "@transmute/jsonld-document-loader";
const documentLoader = documentLoaderFactory.build({
  ["did:key"]: async (didUrl: DidUrl) => {
    const endpoint = `https://api.did.actor/api/identifiers/${didUrl}`;
    const { data } = await axios.get(endpoint);
    return data.didDocument;
  },
});
const result = await documentLoader(
  "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn"
);
// {
//   document: {
//     id: 'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
//     type: 'JsonWebKey2020',
//     controller: 'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
//     publicKeyJwk: {
//       kty: 'OKP',
//       crv: 'Ed25519',
//       x: '0-e2i2_Ua1S5HbTYnVB0lj2Z2ytXu2-tYmDFf8f5NjU'
//     }
//   }
// }
```

### DID Dereference with Context

```ts
import axios from "axios";
import {
  documentLoaderFactory,
  DidUrl,
} from "@transmute/jsonld-document-loader";
const documentLoader = documentLoaderFactory.build({
  ["did:key"]: async (didUrl: DidUrl) => {
    const endpoint = `https://api.did.actor/api/identifiers/${didUrl}`;
    const { data } = await axios.get(endpoint);
    return data.didDocument;
  },
});
const result = await documentLoader(
  "did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn",
  {
    accept: "application/ld+json",
  }
);
// {
//   document: {
//     '@context': [
//       'https://www.w3.org/ns/did/v1',
//       'https://w3id.org/security/suites/jws-2020/v1'
//     ],
//     id: 'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
//     type: 'JsonWebKey2020',
//     controller: 'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
//     publicKeyJwk: {
//       kty: 'OKP',
//       crv: 'Ed25519',
//       x: '0-e2i2_Ua1S5HbTYnVB0lj2Z2ytXu2-tYmDFf8f5NjU'
//     }
//   }
// }
```
