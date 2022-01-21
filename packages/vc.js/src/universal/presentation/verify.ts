import * as ld from "../../vc-ld";

import { VerifyPresentationOptions, VerificationResult } from "../../types";
import { getVerifierForJwt } from "../../vc-jwt/getVerifierForJwt";

export const verify = async (
  options: VerifyPresentationOptions
): Promise<VerificationResult> => {
  const result: any = {
    verified: false
  };

  if (!options.format) {
    options.format = ["vp"];
  }

  if (
    options.format.includes("vp") &&
    (options.presentation as any)["@context"]
  ) {
    return ld.verifyVerifiablePresentation({
      presentation: options.presentation,
      suite: options.suite,
      domain: options.domain,
      challenge: options.challenge,
      checkStatus: options.checkStatus,
      documentLoader: options.documentLoader
    });
  }

  // vp-jwt's are strings with an encoded vp member that conforms to the data model
  if (
    options.format.includes("vp-jwt") &&
    !(options.presentation as any)["@context"]
  ) {
    const verifier = await getVerifierForJwt(
      options.presentation as string,
      options
    );
    const verified = await verifier.verify({
      signature: options.presentation
    });
    result.verified = verified;
  }

  return result;
};
