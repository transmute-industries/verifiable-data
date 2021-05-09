### @transmute/jose-ld

```
npm i @transmute/jose-ld@latest --save
```

## Signatures

```ts
import { JWS } from '@transmute/jose-ld';
import { Secp256k1KeyPair } from '@transmute/secp256k1-key-pair';
const k = await Secp256k1KeyPair.generate({
  secureRandom: () => {
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

## Encryption

```ts
import { JWE } from '@transmute/jose-ld';
import { X25519KeyPair } from '@transmute/x25519-key-pair';

const k = await X25519KeyPair.generate({
  secureRandom: () => {
    return crypto.getRandomValues(new Uint8Array(32));
  },
});

const cipher = new JWE.Cipher(X25519KeyPair);
const document = { key1: 'value1', key2: 'value2' };
const recipients = [
  {
    header: {
      kid: k.id,
      alg: 'ECDH-ES+A256KW',
    },
  },
];
const jwe = await cipher.encryptObject({
  obj: document,
  recipients,
  publicKeyResolver: async (id: string) => {
    if (id === k.id) {
      return k;
    }
    throw new Error(
      'publicKeyResolver does not suppport IRI ' + JSON.stringify(id)
    );
  },
});
const plaintext = await cipher.decrypt({ jwe, keyAgreementKey: k });
```
