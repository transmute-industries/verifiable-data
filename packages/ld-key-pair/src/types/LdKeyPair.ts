import { Signer } from "./Signer";
import { Verifier } from "./Verifier";
import { DeriveSecret } from "./DeriveSecret";

export interface LdKeyPairStatic {
  generate: (options: any) => Promise<any>;
  fromFingerprint({ fingerprint }: { fingerprint: string }): Promise<any>; // import from a fingerprint
  from(serialized: any): Promise<any>; // import from a serialization
}

export interface LdKeyPairInstance {
  fingerprint(): Promise<string>; // produce a fingerprint
  export({
    type,
    privateKey
  }: {
    type: any;
    privateKey?: boolean;
  }): Promise<any>; // create serialization
  signer?: Signer; // create signature
  verifier?: Verifier; // check signature
  deriveSecret?: DeriveSecret; // only for key agreement / ecdh
  getDerivedKeyPairs?: () => Promise<any[]>; // only derivable key pairs like ed25519 to x25519
  getPairedKeyPairs?: () => Promise<any[]>; // only for pairing friendly curves
}

export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    //eslint-disable-next-line
    constructor;
  };
}
