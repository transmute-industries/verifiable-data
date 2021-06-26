import * as Factory from 'factory.ts';

import * as Wallet from '@transmute/universal-wallet';
import * as DidKey from '@transmute/universal-wallet-did-key-plugin';
import * as DidWeb from '@transmute/universal-wallet-did-web-plugin';
import * as Vc from '@transmute/universal-wallet-vc-plugin';
import * as Vp from '@transmute/universal-wallet-vp-exchange-plugin';
// import * as Edv from '@transmute/universal-wallet-edv-plugin';

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
  //   ...Edv.factoryDefaults,
})
  .combine(Wallet.walletFactory as any)
  .combine(DidKey.pluginFactory)
  .combine(DidWeb.pluginFactory as any)
  .combine(Vc.pluginFactory as any)
  .combine(Vp.pluginFactory);
//   .combine(Edv.pluginFactory);
