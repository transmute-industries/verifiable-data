import { KeyPair } from "./KeyPair";
/**
 * defines the ability to sign based on a KeyPair or only
 * from a private key and get results in a default or specified encoding
 */
export interface Signer {
  privateKey: any;
  keyPair?: KeyPair;
  sign(options: { data: any; encoding?: string }): any;
}
