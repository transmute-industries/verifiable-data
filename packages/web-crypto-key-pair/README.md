### @transmute/web-crypto-key-pair

```
npm i @transmute/web-crypto-key-pair@latest --save
```

Linked Data Key Pair support for Web Crypto.

```ts
import * as web from '@transmute/web-crypto-key-pair';
const key = await web.KeyPair.generate({ kty: 'EC', crvOrSize: 'P-384' });
const signer = await key.signer();
const verifier = await key.verifier();
const signature = await signer.sign({
  data: Buffer.from('hello'),
});
const verified = await verifier.verify({
  data: Buffer.from('hello'),
  signature,
});
const remote = await key.export({
  type: 'JsonWebKey2020',
  privateKey: false,
});
const bits = await key.deriveBits(remote);
```
