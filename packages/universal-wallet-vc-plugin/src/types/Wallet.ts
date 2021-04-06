import { Wallet } from "@transmute/universal-wallet";
import { VcPlugin } from "./Plugin";
export interface VcWalletFactory extends Wallet, VcPlugin {}
