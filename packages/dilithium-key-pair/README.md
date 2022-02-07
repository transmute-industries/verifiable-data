### @transmute/dilithium-key-pair

This is very experimental. Not for production use.

```sh
npm i @transmute/dilithium-key-pair@latest --save
```

```ts
import { DilithiumKeyPair } from "@transmute/dilithium-key-pair";
const k = await DilithiumKeyPair.generate();
const signer = k.signer();
const verifier = k.verifier();
const message = Buffer.from("hello world");
const signature = await signer.sign({ data: message });
const verified = await verifier.verify({ data: message, signature });
```

## About

Originally based on [mesur-io/dilithium](https://github.com/mesur-io/dilithium).

The purpose of this module is to maintain an independent tool chain for dilithium in js based on the original submission to NIST.

This module should be considered highly unstable until dilithium alg and kty are registered with IANA.

The C code here was copied from the repo above, see its LICENSE:

https://github.com/mesur-io/dilithium/blob/master/LICENSE
