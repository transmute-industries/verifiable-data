import { VerifiableCredential } from "./VerifiableCredential";

import { CredentialFormat } from "./CredentialFormat";

import { DocumentLoader } from "./DocumentLoader";
import { Suite } from "./Suite";

export interface DeriveCredentialOptions {
  credential: VerifiableCredential;
  frame: any;

  suite: Suite;
  documentLoader: DocumentLoader;

  format?: Array<CredentialFormat>;
}
