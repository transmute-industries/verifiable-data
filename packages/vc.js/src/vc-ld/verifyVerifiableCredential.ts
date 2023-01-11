import * as ldp from "@transmute/linked-data-proof";

import { checkCredential } from "../checkCredential";
import { CredentialIssuancePurpose } from "./CredentialIssuancePurpose";

export const verifyVerifiableCredential = async (options: {
  credential: any;
  suite: any;
  checkStatus?: any;
  documentLoader: any;
  expansionMap?: boolean;
}) => {
  const { credential, checkStatus, documentLoader } = options;
  const compactProof = false;
  if (options.expansionMap !== undefined) {
    const message = "The default options are not being used.";
    throw new Error(message);
  }
  try {
    if (!credential) {
      throw new TypeError('A "credential" property is required for verifying.');
    }

    // run common credential checks
    await checkCredential(credential, { documentLoader });

    // if credential status is provided, a `checkStatus` function must be given
    if (
      credential.credentialStatus &&
      typeof options.checkStatus !== "function"
    ) {
      throw new TypeError(
        'A "checkStatus" function must be given to verify credentials with ' +
          '"credentialStatus".'
      );
    }

    const purpose = new CredentialIssuancePurpose();

    const result = await ldp.verify(credential, {
      ...options,
      purpose,
      compactProof
    });

    // if verification has already failed, skip status check
    if (!result.verified) {
      return result;
    }

    if (credential.credentialStatus) {
      result.statusResult = await checkStatus(options);
      if (!result.statusResult.verified) {
        result.verified = false;
      }
    }

    return result;
  } catch (error) {
    return {
      verified: false,
      results: [{ credential, verified: false, error }],
      error
    };
  }
};
