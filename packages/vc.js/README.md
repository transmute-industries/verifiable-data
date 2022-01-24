# @transmute/vc.js

```
npm i @transmute/vc.js --save
```

## Usage

```
npm t
```

This package generates a series of fixtures using Digital Bazaar's libraries.
To freshly generate these fixtures, use the following command

```
npm run generate:fixtures
```

### Create Verifiable Credential

Also known as credential issuance.

This library supports issuing in as a `vc` or `vc-jwt`.

```ts
import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020,
} from "@transmute/json-web-signature";
import { documentLoader } from "path/somewhere";
import { verifiable } from "@transmute/vc.js";

const key = {
  id: "did:key:z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr#z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr",
  type: "JsonWebKey2020",
  controller: "did:key:z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr",
  publicKeyJwk: {
    kty: "OKP",
    crv: "Ed25519",
    x: "ijtvFnowiumYMcYVbaz6p64Oz6bXwe2V_9IlCgDR_38",
  },
  privateKeyJwk: {
    kty: "OKP",
    crv: "Ed25519",
    x: "ijtvFnowiumYMcYVbaz6p64Oz6bXwe2V_9IlCgDR_38",
    d: "ZrHpIW1JBb-sK2-wzKV0mQjbxpnxjUCu151QZ9_F_Vs",
  },
};

const credential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/security/suites/jws-2020/v1",
  ],
  id: "http://example.edu/credentials/3732",
  type: ["VerifiableCredential"],
  issuer: {
    id: "did:key:z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr",
  },
  issuanceDate: "2010-01-01T19:23:24Z",
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
  },
};

const result = await verifiable.credential.create({
  credential,
  format: ["vc", "vc-jwt"],
  documentLoader: documentLoader,
  suite: new JsonWebSignature({
    key: await JsonWebKey.from(key as JsonWebKey2020),
  }),
});
```

### Create Verifiable Presentation

```ts
import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020,
} from "@transmute/json-web-signature";
import { documentLoader } from "path/somewhere";
import { key } from "path/somewhere";
import { verifiable } from "@transmute/vc.js";

const presentation = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/security/suites/jws-2020/v1",
  ],
  type: ["VerifiablePresentation"],
  holder: {
    id: key.controller,
  },
};

const result = await verifiable.presentation.create({
  presentation,
  format: ["vp", "vp-jwt"],
  documentLoader: documentLoader,
  challenge: "123", // this is supplied by the verifier / presentation recipient
  suite: new JsonWebSignature({
    key: await JsonWebKey.from(fixtures.key as JsonWebKey2020),
  }),
});
```

### Verify Presentation

```ts
import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020,
} from "@transmute/json-web-signature";
import { documentLoader } from "path/somewhere";
import { verifiable } from "@transmute/vc.js";
import { presentation } from "path/somewhere";

const result = await verifiable.presentation.verify({
  presentation,
  format: ["vp", "vp-jwt"],
  documentLoader: documentLoader,
  challenge: "123", // this is supplied by the verifier / presentation recipient
  suite: new JsonWebSignature(),
});
```

### Verify Credential

```ts
import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020,
} from "@transmute/json-web-signature";
import { documentLoader } from "path/somewhere";
import { verifiable } from "@transmute/vc.js";
import { credential } from "path/somewhere";

const result = await verifiable.credential.verify({
  credential,
  format: ["vc", "vc-jwt"],
  documentLoader: documentLoader,
  suite: [new JsonWebSignature()],
});
```

### About

This library has been adapted from older versions of [digitalbazaar/vc](https://github.com/digitalbazaar/vc).

The primary changes have been adding support for vc-jwt, changes to validation and documentLoader requirements.

## License

See the License for [digitalbazaar/vc](https://github.com/digitalbazaar/vc/blob/master/LICENSE).

````

Copyright (c) 2010-2018 Digital Bazaar, Inc.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

```

```
````
