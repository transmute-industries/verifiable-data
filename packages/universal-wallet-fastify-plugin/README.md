### @transmute/universal-wallet-fastify-plugin

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
  apis: ['issuer', 'verifier'],
  documentLoader: {
    allowNetwork: true,
  },
  get,
};

// service
fastify.register(walletPlugin(walletOptions));
// routes that use service
fastify.register(walletRoutes(walletOptions), { prefix: '/accounts' });
```
