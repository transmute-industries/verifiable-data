import { Issuer } from "./Issuer";
import { Type } from "./Type";

export interface CredentialCheckObject {
  "@context"?: any;
  issuer?: Issuer;
  type?: Type;
  issuanceDate?: string;
  proof?: any;
  [x: string]: any;
}

type CredentialCheck = CredentialCheckObject | string;

export default CredentialCheck;
