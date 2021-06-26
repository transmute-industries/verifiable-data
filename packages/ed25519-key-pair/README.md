### @transmute/ed25519-key-pair

```
npm i @transmute/ed25519-key-pair@latest --save
```

```ts
import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';
const k = await Ed25519KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
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
