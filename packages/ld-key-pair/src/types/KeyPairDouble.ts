import { KeyPair } from "./KeyPair";
/**
 * allows for ordered and consistent pair of Key Pairs for use
 * with items such as pairing friendly keys, etc.
 */
export interface KeyPairDouble {
  id: string;
  type: any;
  controller?: any;
  keyOne: KeyPair;
  keyTwo: KeyPair;
  /**
   * should call generate for each key pair based on type
   * @param options
   */
  generate(options: any): KeyPairDouble;
  fingerprint(): string;
  fromFingerprint(options: { fingerprint: string; encoding?: string }): KeyPair;
  export(options: { exportPrivate: boolean; encoding?: string }): any;
}
