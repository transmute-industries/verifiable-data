### @transmute/hl

This package is a fork of [digitalbazaar/hashlink](https://github.com/digitalbazaar/hashlink).

We added some types and minor code splitting.

```
npm i @transmute/hl@latest --save
```

#### Usage

```js
const hl = require('@transmute/hl');
const credential = require('./credential.json');

it('verifiable credential to hashlink', async () => {
  const link = await hl.encode({
    url: credential.id,
    data: Buffer.from(JSON.stringify(credential)),
  });
  expect(link).toBe(
    'hl:zQmZYUEoPBfMoF49szD91QPCHvxVhZdk7dW9bKkjGVmMxov:z91A4gUDnQrwWk4gScqqsRzNkkjzXBBTZZi6nwhH7M7EP6EHRr4eXAHo'
  );
});
```
