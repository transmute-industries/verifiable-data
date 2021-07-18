import { VerifiableCredential } from "./VerifiableCredential";
import { JWT } from "./JWT";

import { CredentialFormat } from "./CredentialFormat";

import { DocumentLoader } from "./DocumentLoader";
import { Suite } from "./Suite";

export interface CreateCredentialOptions {
  credential: VerifiableCredential | JWT;
  format: Array<CredentialFormat>;
  suite: Array<Suite> | Suite;
  documentLoader: DocumentLoader;
}
