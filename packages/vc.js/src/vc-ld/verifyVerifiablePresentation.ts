import * as ldp from "@transmute/linked-data-proof";
import jsonld from "jsonld";
import { checkPresentation } from "../checkPresentation";

import { verifyVerifiableCredential } from "./verifyVerifiableCredential";

export const verifyVerifiablePresentation = async (options: any) => {
  const { documentLoader, domain, challenge } = options;
  const strict = options.strict || "warn";

  const { presentation } = options;

  if (!documentLoader) {
    throw new TypeError(
      '"documentLoader" parameter is required for verifying.'
    );
  }

  if (!presentation) {
    throw new TypeError('A "presentation" property is required for verifying.');
  }
  try {
    await checkPresentation(presentation, { documentLoader, strict });
  } catch (e) {
    return {
      verified: false,
      errors: [e]
    };
  }

  if (
    (!presentation.proof && !presentation.verifiableCredential) ||
    (presentation.verifiableCredential &&
      presentation.verifiableCredential.length === 0)
  ) {
    const message =
      'presentation MUST contain "proof" or "verifiableCredential"';
    throw new Error(message);
  }

  if (!presentation.proof) {
    const message = 'presentation MUST contain "proof" when strict';
    if (strict == "warn") {
      console.warn(message);
    }
    if (strict == "throw") {
      throw new Error(message);
    }
  }

  const result: { verified: boolean; errors?: any } = {
    verified: false
  };

  if (!presentation.proof) {
    const credentials = await Promise.all(
      jsonld
        .getValues(presentation, "verifiableCredential")
        .map(async (credential: any) => {
          const res = await verifyVerifiableCredential({
            credential,
            ...options
          });
          return {
            credentialId: credential.id,
            ...res
          };
        })
    );
    result.verified = credentials.every((r: any) => r.verified);
    if (!result.verified) {
      result.errors = credentials;
    }
  } else {
    const purpose = new ldp.purposes.AuthenticationProofPurpose({
      domain,
      challenge
    });
    const res = await ldp.verify(presentation, {
      ...options,
      purpose
    });
    result.verified = res.verified;
    if (!result.verified) {
      result.errors = [res];
    }
  }
  return result;
};
