### @transmute/secp256k1-key-pair

```
npm i @transmute/secp256k1-key-pair@latest --save
```

```ts
import { Secp256k1KeyPair } from '@transmute/secp256k1-key-pair';
const k = await Secp256k1KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
      'hex'
    );
  },
});
const signer = k.signer();
const verifier = k.verifier();
const message = Buffer.from('hello');
const signature = await signer.sign({ data: message });
const verified = await verifier.verify({ data: message, signature });
```
