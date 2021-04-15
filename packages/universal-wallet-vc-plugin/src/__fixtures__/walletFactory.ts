import * as Factory from "factory.ts";
import * as Wallet from "@transmute/universal-wallet";
import * as Vc from "../index";

export interface WalletFactory extends Wallet.Wallet, Vc.VcPlugin {}

export const walletFactory = Factory.Sync.makeFactory<WalletFactory>({
  ...Wallet.walletDefaults,
  ...Vc.factoryDefaults
})
  .combine(Wallet.walletFactory)
  .combine(Vc.pluginFactory);
