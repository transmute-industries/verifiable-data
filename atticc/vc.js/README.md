# @transmute/vc.js

This typescript module has been built to support direct substitutability with [digitalbazaar/vc-js](https://github.com/digitalbazaar/vc-js) for Linked Data Proof based Verifiable Credentials.

However, some changes were made to support typescript, and no `defaultDocumentLoader` is provided.

Additionally, this module provides test vectors for both [Ed25519Signature2018](https://w3c-ccg.github.io/ld-cryptosuite-registry/#ed25519signature2018) based Linked Data Proof Verifiable Credentials and [EdDSA](https://tools.ietf.org/html/rfc8037#section-3.1) based JWT Verifiable Credentials.

Beware that while JOSE and JWT tooling is widespread, there are security implications for supporting specific keys and algorithms, especially the "NIST Curves".

Please review [https://safecurves.cr.yp.to/](https://safecurves.cr.yp.to/) before leveraging ECDH, ECDSA, EdDSA or more generally... you are responsible for selecting cryptography that is appropriate for your users / customers...

## Usage

- [Web Demo](https://transmute-industries.github.io/vc.js/)
- [Web Demo Source](https://github.com/transmute-industries/vc.js/blob/master/packages/web-app-smoke-tester/src/App.js)

### Linked Data Proofs

#### Imports / Setup

```js
import { Ed25519KeyPair } from '@transmute/did-key-ed25519';
import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';
import * as vcjs from '@transmute/vc.js';
import { documentLoader } from './documentLoader';
const didDoc = require('./did-doc.json');
const _credential = require('./credential.json');
console.log({ didDoc });
```

#### Keys & Suites

```js
const key = await Ed25519KeyPair.from(didDoc.publicKey[0]);
key.id = key.controller + key.id;
console.log({ key });
const suite = new Ed25519Signature2018({
  key,
  date: '2019-12-11T03:50:55Z',
});
console.log({ suite });
```

#### Issue Credential

```js
const credential = {
  ..._credential,
  issuer: { id: didDoc.id },
  credentialSubject: {
    ..._credential.credentialSubject,
    id: didDoc.id,
  },
};
const verifiableCredential = await vcjs.ld.issue({
  credential,
  suite,
  documentLoader,
});
console.log({ verifiableCredential });
```

#### Prove Presentation

```js
const id = 'ebc6f1c2';
const holder = 'did:ex:12345';
const challenge = '123';
const presentation = await vcjs.ld.createPresentation({
  verifiableCredential: verifiableCredential,
  id,
  holder,
});
console.log({ presentation });
const verifiablePresentation = await vcjs.ld.signPresentation({
  presentation,
  suite,
  challenge,
  documentLoader,
});
```

#### Verify Presentation

```js
console.log({ verifiablePresentation });
const presentationVerified = await vcjs.ld.verify({
  presentation: verifiablePresentation,
  suite,
  challenge,
  documentLoader,
});
console.log({ presentationVerified });
```

### JSON Web Tokens

#### Imports / Setup

```js
import { EdDSA } from '@transmute/did-key-ed25519';
import * as vcjs from '@transmute/vc.js';
// import {documentLoader} from './documentLoader'
const didDoc = require('./did-doc.json');
const _credential = require('./credential.json');

const signerFactory = (controller, jwk) => {
  return {
    sign: (payload, header) => {
      // typ: 'JWT', MUST NOT be present per well known did configuration...
      header.kid = controller + jwk.kid;
      return EdDSA.sign(payload, jwk, header);
    },
  };
};

const verifyFactory = jwk => {
  return {
    verify: jws => {
      const verified = EdDSA.verify(jws, jwk, {
        complete: true,
      });
      delete verified.key;
      return verified;
    },
  };
};

const signer = signerFactory(
  'did:example:123',
  didDoc.publicKey[1].privateKeyJwk
);
const verifier = verifyFactory(didDoc.publicKey[1].publicKeyJwk);

const credential = {
  ..._credential,
  issuer: { id: didDoc.id },
  credentialSubject: {
    ..._credential.credentialSubject,
    id: didDoc.id,
  },
};
const vpOptions = {
  domain: 'verifier.com',
  challenge: '7cec01f7-82ee-4474-a4e6-feaaa7351e48',
};

console.log({ didDoc });
```

#### Issue Credential

```js
const credentialIssued = await vcjs.jwt.issue(credential, signer);
console.log({ credentialIssued });
```

#### Verify Credential

```js
const credentialVerified = await vcjs.jwt.verify(credentialIssued, verifier);
console.log({ credentialVerified });
```

#### Prove Presentation

```js
const presentationCreated = await vcjs.jwt.createPresentation(
  [credentialIssued],
  'did:example:456'
);
console.log({ presentationCreated });
const presentationProved = await vcjs.jwt.provePresentation(
  presentationCreated,
  vpOptions,
  signer
);
console.log({ presentationProved });
```

#### Verify Presentation

```js
const presentationVerified = await vcjs.jwt.verify(
  presentationProved,
  verifier
);
console.log({ presentationVerified });
```

## License

See the License for [digitalbazaar/vc-js](https://github.com/digitalbazaar/vc-js/blob/master/LICENSE).

```
Copyright (c) 2017-2020, Digital Bazaar, Inc.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```
