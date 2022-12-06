import key from "./key.json";
import credential from "./credential.json";
import verifiableCredential from "./verifiableCredential.json";
import verifiablePresentation from "./verifiablePresentation.json";
import controller from "./controller.json";
import { documentLoader } from "./documentLoader";
import revokedCredential from "./revokedCredential.json";

import signedRevocationList2020 from "./signed-revocation-list-2020.json";
import signedCredentialWithRevocationStatus from "./signed-credential-with-revocation-status.json";
import * as checkStatus from "./checkStatus";

// export * from './encodedList100k';
// export * from './encodedList100KWith50KthRevoked';
// export * from './revocationListCredential';

export {
  key,
  credential,
  verifiableCredential,
  verifiablePresentation,
  controller,
  signedRevocationList2020,
  signedCredentialWithRevocationStatus,
  revokedCredential,
  documentLoader,
  checkStatus
};
