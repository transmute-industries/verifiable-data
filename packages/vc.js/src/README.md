Originally, the source files here we directly
substitutable with digital bazaar's implementations.

However, due to a number of breaking changes, it now
seems worth it to stretch for better interfaces here.

#### Create Credential

Also known as "Issuing a Verifiable Credential"

```ts
import * as verifiable from "@transmute/vc.js";
import { JsonWebKey, JsonWebSignature } from "@transmute/json-web-signature";

const vc = await verifiable.credential.create({
  credential,
  format,
  documentLoader,
  suite: new JsonWebSignature({
    key: await JsonWebKey.from(source),
  }),
});
```

### Scratch

```ts
import * as verifiable from "@transmute/vc.js";
import { JsonWebKey, JsonWebSignature } from "@transmute/json-web-signature";

const vc = await verifiable.credential.create({
  credential,
  format,
  key: await JsonWebKey.from(json),
  suite: [JsonWebSignature],
  documentLoader,
});
const verified1 = await verifiable.credential.verify({
  credential,
  format,
  suite,
  documentLoader,
});

const vp = await verifiable.presentation.create({
  presentation,
  format,
  suite,
  documentLoader,
});
const verified2 = await verifiable.presentation.verify({
  presentation,
  format,
  suite,
  documentLoader,
});
```
