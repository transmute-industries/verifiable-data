### @transmute/cbor-ld

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
