import { KeyPair } from "./KeyPair";
/**
 * defines the ability to perform verification based on a KeyPair
 * or a public key
 */
export interface Verifier {
  publicKey: any;
  keyPair?: KeyPair;
  verify(options: { data: any; signature: string }): boolean;
}
