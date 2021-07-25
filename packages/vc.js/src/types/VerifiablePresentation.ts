import { LinkedDataDocument } from "./LinkedDataDocument";
import { Type } from "./Type";
import { Holder } from "./Holder";

export interface VerifiablePresentation extends LinkedDataDocument {
  type: Type;
  holder?: Holder;
  verifiableCredential?: any;
  proof?: any;
  [x: string]: any;
}
