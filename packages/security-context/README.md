### @transmute/security-context

```
npm i @transmute/security-context@latest --save
```

#### Usage

```js
const { constants: securityConstants } = require("@transmute/security-context");

export default {
  SECURITY_CONTEXT_URL: securityConstants.SECURITY_CONTEXT_V2_URL,
  // https://w3id.org/security/v1
  SECURITY_CONTEXT_V1_URL: securityConstants.SECURITY_CONTEXT_V1_URL,
  // https://w3id.org/security/v2
  SECURITY_CONTEXT_V2_URL: securityConstants.SECURITY_CONTEXT_V2_URL,
  SECURITY_PROOF_URL: "https://w3id.org/security#proof",
  SECURITY_SIGNATURE_URL: "https://w3id.org/security#signature",
};
```
