# @transmute/universal-wallet-fastify-plugin

This plugin allows you to use the universal wallet with a nodejs app that uses fastify as it's webserver. The wallet actions can be called by configuring the additional routes the plugin will add by calling those endpoints. You can configure how to store the wallet, whether in memory or in a database in the wallet options.

## How to use

In order to use this plugin in your project you will want to have an existing fastify server setup. Where you are already configuring your FastifyInstance with routes and plugins you can setup the universal wallet plugin and routes in the same place. In the wallet options you can specify which api routes you want to support, in the below example we are requesting all three with a route prefix of /accounts. This would add these to the existing routes:

```
issuer
/accounts/:walletId/credentials/issue

holder
/accounts/:walletId/presentations/prove
/accounts/:walletId/credentials/derive

holder.presentation
/accounts/:walletId/presentations/available
/accounts/:walletId/presentations/submissions

verifier
/accounts/:walletId/credentials/verify
/accounts/:walletId/presentations/verify
```

In general you will need a wallet factory and to build the wallet whenever a new wallet is created and stored in order to use these api calls. In this below example it references `customWalletFactory.build()` but you could do something similar to

```ts
import * as Factory from 'factory.ts';

import * as Wallet from '@transmute/universal-wallet';
import * as DidKey from '@transmute/universal-wallet-did-key-plugin';
import * as DidWeb from '@transmute/universal-wallet-did-web-plugin';
import * as Vc from '@transmute/universal-wallet-vc-plugin';
import * as Vp from '@transmute/universal-wallet-vp-exchange-plugin';

export interface FastifyWalletFactory
  extends Wallet.Wallet,
    DidKey.DidKeyPlugin,
    DidWeb.DidWebPlugin,
    Vc.VcPlugin,
    Vp.VpxPlugin {}

export const walletFactory = Factory.Sync.makeFactory<FastifyWalletFactory>({
  ...Wallet.walletDefaults,
  ...DidKey.factoryDefaults,
  ...DidWeb.factoryDefaults,
  ...Vc.factoryDefaults,
  ...Vp.factoryDefaults,
})
  .combine(Wallet.walletFactory)
  .combine(DidKey.pluginFactory)
  .combine(DidWeb.pluginFactory)
  .combine(Vc.pluginFactory)
  .combine(Vp.pluginFactory);
```

If you are supporting holder.presentation the api is dependant on `@transmute/universal-wallet-vp-exchange-plugin`. You'll need a wallet that is stored already and has this plugin as part of the wallet factory, around where the wallet factory is referencing `import * as Vp from '@transmute/universal-wallet-vp-exchange-plugin';`

```
npm i @transmute/universal-wallet-fastify-plugin@latest --save
```

```ts
import Fastify from 'fastify';
import {
  walletFactory,
  walletPlugin,
  walletRoutes,
} from '@transmute/universal-wallet-fastify-plugin';

import { documentLoader } from '../somewhere/documentLoader.ts';

const fastify = Fastify();

const get = async (accountId: string) => {
  const wallet = customWalletFactory.build();
  const accountEncryptedWallet = await getAccountEncryptedWallet(accountId);
  const password = await getAccountEncryptedWalletPassword(accountId);
  return wallet.import(accountEncryptedWallet, password);
};

const walletOptions = {
  walletId: 'accountId',
  origin: 'https://platform.example',
  discovery: ['did:web'],
  apis: ['issuer', 'holder', 'verifier'],
  documentLoader,
  hooks: {
      preValidation: [
        // YOU MUST REVIEW https://www.fastify.io/docs/latest/Hooks/#prevalidation
        // Make certain you understand how to secure fastify endpoints before using this plugin.
        },
      ],
    },
  get,
};

// service
fastify.register(walletPlugin(walletOptions));
// routes that use service
fastify.register(walletRoutes(walletOptions), { prefix: '/accounts' });
```

## Holder presenting

### /presentations/available

This api call is part of the holder exchange subset of api calls. It will add to the wallet contents the one time challenge. You can find out more about the data structure for request for data in the presentation here:
https://w3c-ccg.github.io/vp-request-spec/#format

### /presentations/submissions

This api call is part of the holder exchange subset of api calls. It will use and remove the one time challenge and add to the wallet contents the verifiable credentials wrapped and signed by the verifiable presentation.
