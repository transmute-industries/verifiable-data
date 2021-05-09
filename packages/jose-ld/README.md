### @transmute/jose-ld

```
npm i @transmute/jose-ld@latest --save
```

```ts
import { JWS } from '@transmute/jose-ld';
import { Secp256k1KeyPair } from '@transmute/secp256k1-key-pair';
const k = await Secp256k1KeyPair.generate({
  secureRandom: async () => {
    return Buffer.from(
      '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
      'hex'
    );
  },
});
const signer = JWS.createSigner(k.signer(), 'ES256K', { detached: true });
const verifier = JWS.createVerifier(k.verifier(), 'ES256K', {
  detached: true,
});
const message = Uint8Array.from(Buffer.from('hello'));
const signature = await signer.sign({ data: message });
const verified = await verifier.verify({
  data: message,
  signature,
});
```
