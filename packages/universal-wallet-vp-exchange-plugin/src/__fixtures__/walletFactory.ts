import * as Factory from "factory.ts";
import * as Wallet from "@transmute/universal-wallet";
import * as VcPlugin from "@transmute/universal-wallet-vc-plugin";
import * as VpxPlugin from "../index";

export interface FixtureWalletFactory
  extends Wallet.Wallet,
    VcPlugin.VcPlugin,
    VpxPlugin.VpxPlugin {}

export const walletFactory = Factory.Sync.makeFactory<FixtureWalletFactory>({
  ...VcPlugin.factoryDefaults,
  ...VpxPlugin.factoryDefaults,
  ...Wallet.walletDefaults
})
  .combine(VcPlugin.pluginFactory)
  .combine(VpxPlugin.pluginFactory)
  .combine(Wallet.walletFactory);
