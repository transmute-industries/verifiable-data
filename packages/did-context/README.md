### @transmute/did-context

```
npm i @transmute/did-context@latest --save
```

#### Usage

```js
const didContexts = require("@transmute/did-context");
export default {
  // https://www.w3.org/ns/did/v1
  [didContexts.constants.DID_CONTEXT_V1_URL]: didContexts.contexts.get(
    didContexts.constants.DID_CONTEXT_V1_URL
  ),
};
```

##### Extension Use

See [transmute extension registry](https://ns.did.ai/)

```js
const didContexts = require("@transmute/did-context");
export default {
  // https://www.w3.org/ns/did/v1
  [didContexts.constants.DID_CONTEXT_V1_URL]: didContexts.contexts.get(
    didContexts.constants.DID_CONTEXT_V1_URL
  )
};
```
