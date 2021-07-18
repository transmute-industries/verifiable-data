import { VerifiablePresentation } from "./VerifiablePresentation";
import { JWT } from "./JWT";

import { PresentationFormat } from "./PresentationFormat";

import { DocumentLoader } from "./DocumentLoader";
import { Suite } from "./Suite";

export interface CreateVerifiablePresentationOptions {
  presentation: VerifiablePresentation | JWT;
  format: Array<PresentationFormat>;
  suite: Array<Suite> | Suite;
  documentLoader: DocumentLoader;
  challenge: string;

  domain?: string;
}
