import { PublicNode } from "./PublicNode";
import { PrivateNode } from "./PrivateNode";
import { Signer } from "./Signer";
import { Verifier } from "./Verifier";

/**
 * defines the common properties and methoods in use by
 * key pairs in the LD realm based on existing implementations
 */
export interface KeyPair extends PublicNode, PrivateNode {
  /**
   * exports a key, with or without private key material, in specified or default format
   * @param options
   */
  export(options: { exportPrivate: boolean; encoding?: string }): any;

  generate(options: any): KeyPair;

  fingerprint(): string;
  verifyFingerprint(options: { fingerprint: string }): boolean;
  fromFingerprint(options: { fingerprint: string }): KeyPair;
  fingerprintFromPublicKey(options: {
    publicKey: any;
    publicKeyEncoding: string;
  }): string;

  signer(): Signer;
  verifier(): Verifier;
}
