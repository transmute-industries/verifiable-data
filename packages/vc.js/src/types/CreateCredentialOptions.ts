import { VerifiableCredential } from "./VerifiableCredential";
import { JWT } from "./JWT";

import { CredentialFormat } from "./CredentialFormat";

import { DocumentLoader } from "./DocumentLoader";
import { Suite } from "./Suite";

export interface CreateCredentialOptions {
  credential: VerifiableCredential | JWT;

  suite: Array<Suite> | Suite;
  documentLoader: DocumentLoader;

  format?: Array<CredentialFormat>;
  strict?: "ignore" | "warn" | "throw";
}
