import * as ldp from "@transmute/linked-data-proof";

import { checkCredential } from "../checkCredential";
import { CredentialIssuancePurpose } from "./CredentialIssuancePurpose";

export const createVerifiableCredential = async (options: {
  credential: any;
  suite: any;
  documentLoader: any;
  strict?: "ignore" | "warn" | "throw";
}) => {
  const { credential, suite, documentLoader } = options;

  const strict = options.strict || "warn";

  // run common credential checks
  if (!credential) {
    throw new TypeError('"credential" parameter is required for issuing.');
  }

  await checkCredential(credential, { documentLoader, strict });

  if (!documentLoader) {
    throw new TypeError('"documentLoader" parameter is required for issuing.');
  }

  if (!suite) {
    throw new TypeError('"suite" parameter is required for issuing.');
  }
  // check to make sure the `suite` has required params
  // Note: verificationMethod defaults to publicKey.id, in suite constructor...
  // ...in some implementations...
  if (!suite.verificationMethod) {
    throw new TypeError('"suite.verificationMethod" property is required.');
  }

  const purpose = new CredentialIssuancePurpose();

  return ldp.sign(credential, { purpose, ...options });
};
