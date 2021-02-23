### @transmute/credentials-context

```
npm i @transmute/credentials-context@latest --save
```

#### Usage

```js
const { constants, contexts } = require("@transmute/credentials-context");

export default {
  // https://www.w3.org/2018/credentials/v1
  [constants.CREDENTIALS_CONTEXT_V1_URL]: contexts.get(
    constants.CREDENTIALS_CONTEXT_V1_URL
  ),
};
```
