import { Signer } from "./Signer";
import { Verifier } from "./Verifier";
import { DeriveSecret } from "./DeriveSecret";

export interface LdKeyPairStatic {
  fromFingerprint({ fingerprint }: { fingerprint: string }): Promise<any>;
  from(serialized: any): Promise<any>;
}

export interface LdKeyPairInstance {
  fingerprint(): Promise<string>;
  export({
    type,
    privateKey
  }: {
    type: any;
    privateKey?: boolean;
  }): Promise<any>;
  signer?: Signer;
  verifier?: Verifier;
  deriveSecret?: DeriveSecret;
}

export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    //eslint-disable-next-line
    constructor;
  };
}
