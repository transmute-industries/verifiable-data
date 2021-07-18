import { JWT } from "./JWT";
import { VerifiableCredential } from "./VerifiableCredential";
import { CredentialFormat } from "./CredentialFormat";
import { DocumentLoader } from "./DocumentLoader";
import { Suite } from "./Suite";

export interface VerifyCredentialOptions {
  credential: VerifiableCredential | JWT;
  format: Array<CredentialFormat>;
  suite: Array<Suite> | Suite;
  documentLoader: DocumentLoader;
}
