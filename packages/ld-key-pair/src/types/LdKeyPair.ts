// // import { PublicNode } from "./PublicNode";
// // import { PrivateNode } from "./PrivateNode";
// // import { Signer } from "./Signer";
// // import { Verifier } from "./Verifier";

// /**
//  * defines the common properties and methoods in use by
//  * key pairs in the LD realm based on existing implementations
//  */
// export interface LdKeyPair {
//   /**
//    * exports a key, with or without private key material, in specified or default format
//    * @param options
//    */

//   // signer(): Signer;
//   // verifier(): Verifier;
// }

// export interface KeyPairClass {
//   export(options: { exportPrivate: boolean; encoding?: string }): any;
//   generate(options: any): KeyPairClass;
//   fingerprint(): string;
//   verifyFingerprint(options: { fingerprint: string }): boolean;
//   fromFingerprint(options: { fingerprint: string }): KeyPairClass;
//   fingerprintFromPublicKey(options: {
//     publicKey: any;
//     publicKeyEncoding: string;
//   }): string;
// }

export interface LdKeyPairStatic {
  fromFingerprint({ fingerprint }: { fingerprint: string }): Promise<any>;
  from(serialized: any): Promise<any>;
}

export interface LdKeyPairInstance {
  fingerprint(): Promise<string>;
  export({
    type,
    privateKey,
  }: {
    type: "JsonWebKey2020" | "Ed25519VerificationKey2018";
    privateKey?: boolean;
  }): Promise<any>;
}

// /* class decorator */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

export interface LdKeyPair extends LdKeyPairStatic, LdKeyPairInstance {}
