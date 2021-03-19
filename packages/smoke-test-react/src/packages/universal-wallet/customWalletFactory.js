import * as Factory from "factory.ts";

import * as Wallet from "@transmute/universal-wallet";
import * as DidKey from "@transmute/universal-wallet-did-key-plugin";
import * as Vc from "@transmute/universal-wallet-vc-plugin";

const customWalletFactory = Factory.Sync.makeFactory({
  ...Wallet.walletDefaults,
  ...DidKey.factoryDefaults,
  ...Vc.factoryDefaults,
})
  .combine(Wallet.walletFactory)
  .combine(DidKey.pluginFactory)
  .combine(Vc.pluginFactory);

export { customWalletFactory };
