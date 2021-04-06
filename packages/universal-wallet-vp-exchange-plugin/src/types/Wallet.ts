import { Wallet } from "@transmute/universal-wallet";
import { VpxPlugin } from "./Plugin";
export interface VpxWalletFactory extends Wallet, VpxPlugin {}
