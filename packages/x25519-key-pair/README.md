### @transmute/x25519-key-pair

```
npm i @transmute/x25519-key-pair@latest --save
```

```ts
import { X25519KeyPair } from '@transmute/x25519-key-pair';
const k = await X25519KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
      'hex'
    );
  },
});
const s = await k.deriveSecret({
  publicKey: await k.export({ type: 'JsonWebKey2020', privateKey: false }),
});
```
