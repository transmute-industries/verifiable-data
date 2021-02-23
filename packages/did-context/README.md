### @transmute/did-context

```
npm i @transmute/did-context@latest --save
```

#### Usage

```js
const { constants, contexts } = require("@transmute/did-context");
export default {
  // https://www.w3.org/ns/did/v1
  [constants.DID_CONTEXT_V1_URL]: contexts.get(constants.DID_CONTEXT_V1_URL),
};
```
