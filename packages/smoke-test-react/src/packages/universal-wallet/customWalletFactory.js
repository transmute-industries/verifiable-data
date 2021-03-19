import * as Factory from "factory.ts";

import * as Wallet from "@transmute/universal-wallet";
import * as DidKey from "@transmute/universal-wallet-did-key-plugin";
import * as DidWeb from "@transmute/universal-wallet-did-web-plugin";
import * as Vc from "@transmute/universal-wallet-vc-plugin";

const customWalletFactory = Factory.Sync.makeFactory({
  ...Wallet.walletDefaults,
  ...DidKey.factoryDefaults,
  ...DidWeb.factoryDefaults,
  ...Vc.factoryDefaults,
})
  .combine(Wallet.walletFactory)
  .combine(DidKey.pluginFactory)
  .combine(DidWeb.pluginFactory)
  .combine(Vc.pluginFactory);

export { customWalletFactory };
