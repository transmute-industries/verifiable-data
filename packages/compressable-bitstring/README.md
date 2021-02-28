### @transmute/compressable-bitstring

```
npm i @transmute/compressable-bitstring@latest --save
```

## Usage

```ts
import { Bitstring } from '@transmute/compressable-bitstring';
const bitstring = new Bitstring({ length: 8 });
bitstring.set(4, true);
expect(bitstring.get(3)).toBe(false);
expect(bitstring.get(4)).toBe(true);
expect(await bitstring.encodeBits()).toBe('H4sIAAAAAAAAAxMAAOn_tc8BAAAA');
```

## About

This module is based on / interoperable with [digitalbazaar/bitstring](https://github.com/digitalbazaar/bitstring).
