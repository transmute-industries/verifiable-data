### @transmute/cbor-ld

🚧 This module is currently under heavy constuction.

Assume it is non functional for now, and use [digitalbazaar/cborld](https://github.com/digitalbazaar/cborld) instead.

We're working through their implementation to extract some interoperabiity tooling for the codecs and contexts and associated test vectors, as well as trying to reduce dependencies and ensure support for typescript and jest / tsdx.

Currently things are non function.

🚧 Seriously, just use this library instead [digitalbazaar/cborld](https://github.com/digitalbazaar/cborld)

```
npm i @transmute/cbor-ld@latest --save
```

## Usage

```ts
import { encode, decode } from '@transmute/cbor-ld';
const encoded = await encode(document, documentLoader);
const decoded = await decode(encoded, documentLoader);
```

## About

This module is based on / interoperable with [digitalbazaar/cborld](https://github.com/digitalbazaar/cborld).

Some adjustments needed to be made to support typescript and jest.
