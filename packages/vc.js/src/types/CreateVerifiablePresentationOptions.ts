import { VerifiablePresentation } from "./VerifiablePresentation";
import { JWT } from "./JWT";

import { PresentationFormat } from "./PresentationFormat";

import { DocumentLoader } from "./DocumentLoader";
import { Suite } from "./Suite";

export interface CreateVerifiablePresentationOptions {
  presentation: VerifiablePresentation | JWT;

  suite: Array<Suite> | Suite;
  documentLoader: DocumentLoader;
  challenge: string;

  domain?: string;
  format?: Array<PresentationFormat>;
  strict?: "ignore" | "warn" | "throw";
}
