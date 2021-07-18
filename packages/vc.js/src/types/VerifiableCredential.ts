import { LinkedDataDocument } from "./LinkedDataDocument";
import { Type } from "./Type";
import { Issuer } from "./Issuer";

export interface VerifiableCredential extends LinkedDataDocument {
  issuer: Issuer;
  type: Type;
  issuanceDate: string;
  proof?: any;
  [x: string]: any;
}
