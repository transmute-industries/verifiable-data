import { JWT } from "./JWT";
import { VerifiableCredential } from "./VerifiableCredential";
import { CredentialFormat } from "./CredentialFormat";
import { DocumentLoader } from "./DocumentLoader";
import { Suite } from "./Suite";

export interface VerifyCredentialOptions {
  credential: VerifiableCredential | JWT;

  suite: Array<Suite> | Suite;
  documentLoader: DocumentLoader;

  format?: Array<CredentialFormat>;
  checkStatus?: (args: any) => Promise<any>;
  expansionMap?: boolean;
}
