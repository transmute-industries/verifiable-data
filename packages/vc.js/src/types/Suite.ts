import { Key } from "./Key";

export interface Suite {
  key?: Key;
  getVerificationMethod: (options: any) => Promise<Key>;
  deriveProof?: (options: any) => Promise<any>;
}
