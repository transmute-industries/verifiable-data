import * as ldp from "@transmute/linked-data-proof";

import { checkPresentation } from "../checkPresentation";
import { PresentationVerification } from "../types/PresentationVerification";
import { verifyVerifiableCredential } from "./verifyVerifiableCredential";
import { getVerifierForJwt } from "../vc-jwt/getVerifierForJwt";
import { decodeJwt } from "../vc-jwt/decodeJwt";
import { verifyVerifiableCredential as verifyJwt } from "../vc-jwt/verifyVerifiableCredential";
const verifyCredentialsInPresentation = async (
  presentation: any,
  options: any
) => {
  let result: any = { verified: false };
  const results = await Promise.all(
    presentation.verifiableCredential.map(async (credential: any) => {
      if (!credential["@context"]) {
        const verifier = await getVerifierForJwt(credential, options);
        const res = await verifyJwt(credential, { ...options, verifier });
        const decoded = decodeJwt(credential);
        return {
          credentialId: decoded.payload.vc.id || undefined,
          verified: res
        };
      }
      if (credential.credentialStatus && !options.checkStatus) {
        throw new Error(
          "options.checkStatus is required to verify presentation of revocable credentials."
        );
      }
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
  result.verified = results.every((r: any) => r.verified);
  result.results = results;
  return result;
};

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
      presentation: e
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

  const result: PresentationVerification = {
    verified: false
  };

  if (
    presentation.verifiableCredential &&
    presentation.verifiableCredential.length
  ) {
    const credentials = await verifyCredentialsInPresentation(
      presentation,
      options
    );
    result.credentials = credentials;
    if (!credentials.verified) {
      result.verified = false;
    }
  }

  if (presentation.proof) {
    const purpose = new ldp.purposes.AuthenticationProofPurpose({
      domain,
      challenge
    });
    const verification = await ldp.verify(presentation, {
      ...options,
      purpose
    });
    result.presentation = verification;
  } else {
    result.presentation = result.credentials;
  }

  if (result.presentation && !result.credentials) {
    result.verified = result.presentation.verified;
  }

  if (result.presentation && result.credentials) {
    result.verified =
      result.presentation.verified && result.credentials.verified;
  }
  return result;
};
