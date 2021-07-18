import { JWT } from "./JWT";
import { VerifiablePresentation } from "./VerifiablePresentation";
import { PresentationFormat } from "./PresentationFormat";
import { DocumentLoader } from "./DocumentLoader";
import { Suite } from "./Suite";

export interface VerifyPresentationOptions {
  presentation: VerifiablePresentation | JWT;
  format: Array<PresentationFormat>;
  suite: Array<Suite> | Suite;
  documentLoader: DocumentLoader;
  challenge: string;

  domain?: string;
}
