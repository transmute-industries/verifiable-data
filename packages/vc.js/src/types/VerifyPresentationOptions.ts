import { JWT } from "./JWT";
import { VerifiablePresentation } from "./VerifiablePresentation";
import { PresentationFormat } from "./PresentationFormat";
import { DocumentLoader } from "./DocumentLoader";
import { Suite } from "./Suite";

export interface VerifyPresentationOptions {
  presentation: VerifiablePresentation | JWT;

  suite: Array<Suite> | Suite;
  documentLoader: DocumentLoader;
  challenge: string;

  domain?: string;
  checkStatus?: any;
  format?: Array<PresentationFormat>;
}
