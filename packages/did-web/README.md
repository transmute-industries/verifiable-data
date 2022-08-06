### @transmute/did-web

```
npm i @transmute/did-web@latest --save
```

#### Usage

##### DID Web Resolver

```ts
import didWeb from '@transmute/did-web';
const resolve = async (did) => {
  if (did.startsWith('did:web')){
    const didDocument = await didWeb.resolve(did);
    return  { didDocument, didResolutionMetadata: {}};
  }
}
```
