import * as Factory from 'factory.ts';

import * as Wallet from '@transmute/universal-wallet';
import * as DidKey from '@transmute/universal-wallet-did-key-plugin';

const customWalletFactory = Factory.Sync.makeFactory({
  ...Wallet.walletDefaults,
  ...DidKey.factoryDefaults,
})
  .combine(Wallet.walletFactory as any)
  .combine(DidKey.pluginFactory as any);

export { customWalletFactory };
