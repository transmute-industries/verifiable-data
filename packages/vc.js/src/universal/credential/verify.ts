import * as ld from "../../vc-ld";
import { VerifyCredentialOptions, VerificationResult } from "../../types";
import { getVerifierForJwt } from "../../vc-jwt/getVerifierForJwt";
export const verify = async (
  options: VerifyCredentialOptions
): Promise<VerificationResult> => {
  const result: VerificationResult = {
    verified: false
  };

  if (!options.format) {
    options.format = ["vc"];
  }

  if (
    options.format.includes("vc") &&
    (options.credential as any)["@context"]
  ) {
    const res = await ld.verifyVerifiableCredential({
      credential: options.credential,
      suite: options.suite,
      documentLoader: options.documentLoader,
      checkStatus: options.checkStatus,
      expansionMap: options.expansionMap
    });
    result.verified = res.verified;
    if (!result.verified) {
      result.error = [];
      if (res && res.statusResult && !res.statusResult.verified) {
        result.error.push({
          statusResult: res.statusResult
        });
      }
      if (res && res.results[0] && !res.results[0].verified) {
        result.error.push({ proofResult: res.results[0].verified });
      }
      if (res.error) {
        result.error.push(res.error);
      }
    }
  }

  // vc-jwt's are strings with an encoded vc member that conforms to the data model
  if (
    options.format.includes("vc-jwt") &&
    !(options.credential as any)["@context"]
  ) {
    const verifier = await getVerifierForJwt(
      options.credential as string,
      options
    );
    const verified = await verifier.verify({
      signature: options.credential
    });
    result.verified = verified;
  }

  return result;
};
