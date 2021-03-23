# @transmute/universal-wallet-google-secrets

```
npm i @transmute/universal-wallet-google-secrets --save
```

Be sure to enable: [Google Cloud Secret Manager](https://cloud.google.com/secret-manager).

And make sure your service account has the appropriate permissions.

In order to test as a service account by key file use:

```sh
export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/sa-key.json
```

## Usage

```ts
import { pluginFactory } from "@transmute/universal-wallet-google-secrets";

const wallet = pluginFactory.build();

const s0 = await wallet.writeSecret(
  "555555555555",
  "seed",
  "7052adea8f9823817065456ecad5bf24dcd31a698f7bc9a0b5fc170849af4226"
);

const s1 = await wallet.readSecret("555555555555", "seed");
// {
//     '@context': [ 'https://w3id.org/wallet/v1' ],
//     id: 'urn:google:projects/555555555555/secrets/seed/versions/1',
//     type: 'GoogleCloudSecret',
//     tags: [ 'google' ],
//     value: '7052adea8f9823817065456ecad5bf24dcd31a698f7bc9a0b5fc170849af4226'
// }
```

## Getting Started

```
git clone git@github.com:transmute-industries/verifiable-data.git
npm packages/universal-wallet-google-secrets; // note that this is a mono repo
npm i
npm run lint
npm run test
npm run build
```
