### @transmute/revocation-list-context

```
npm i @transmute/revocation-list-context@latest --save
```

#### Usage

```js
const { constants, contexts } = require("@transmute/revocation-list-context");
export default {
  // https://w3id.org/vc-revocation-list-2020/v1
  [constants.REVOCATION_LIST_CONTEXT_V1_URL]: contexts.get(
    constants.REVOCATION_LIST_CONTEXT_V1_URL
  ),
};
```
