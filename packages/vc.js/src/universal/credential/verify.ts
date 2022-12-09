import * as ld from "../../vc-ld";
import { VerifyCredentialOptions, VerificationResult } from "../../types";
import { VerifiableCredential } from '../../types/VerifiableCredential'
import { getVerifierForJwt } from "../../vc-jwt/getVerifierForJwt";
import { decodeJwt } from '../../vc-jwt/decodeJwt';
import moment from "moment";
export const verify = async (
  options: VerifyCredentialOptions
): Promise<VerificationResult> => {
  let credential: any;
  const result: VerificationResult = {
    verified: false,
    verifications: []
  };

  if (!options.format) {
    options.format = ["vc"];
  }

  if (
    options.format.includes("vc") &&
    (options.credential as any)["@context"]
  ) {
    credential = options.credential
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
  let jwtVerificationMethod: any;
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

    const decodedString = decodeJwt(options.credential as string);
    credential = decodedString.payload.vc;
    jwtVerificationMethod =
      decodedString?.header?.kid ?? decodedString.payload.vc.issuer;
  }

  // Signature
  const proofCheckFailed = !!(
    result.error &&
    result.error.find((e: any) => e?.proofResult?.verified === false)
  );

  if (!result.verified && proofCheckFailed) {
    const description = 'This credential has a invalid signature';
    result.verifications.push({
      status: 'bad',
      title: 'Proof',
      description,
    });
  } else {
    result.verifications.push({
      status: 'good',
      title: 'Proof',
      description:
      (options.credential as VerifiableCredential).proof?.verificationMethod ?? jwtVerificationMethod,
    });
  }

  // Activation
  if (credential.issuanceDate) {
    const now = moment();
    const issuanceDate = moment(credential.issuanceDate);
    if (now.isAfter(issuanceDate)) {
      result.verifications.push({
        status: 'good',
        title: 'Activation',
        description: `This credential activated ${issuanceDate.fromNow()}`,
      });
    } else {
      result.verifications.push({
        status: 'bad',
        title: 'Activation',
        description: `This credential activates ${issuanceDate.fromNow()}`,
      });
    }
  }

  // Expiration
  if (credential.expirationDate) {
    const now = moment();
    const expirationDate = moment(credential.expirationDate);
    if (now.isBefore(expirationDate)) {
      result.verifications.push({
        status: 'good',
        title: 'Expired',
        description: `This credential expires ${expirationDate.fromNow()}`,
      });
    } else {
      result.verifications.push({
        status: 'bad',
        title: 'Expired',
        description: `This credential expired ${expirationDate.fromNow()}`,
      });
    }
  }

  // Revocation Status
  if (credential.credentialStatus) {
    const statusCheckFailed = !!(
      result.error &&
      result.error.find((e: any) => e?.statusResult?.verified === false)
    );
    if (!result.verified && statusCheckFailed) {
      result.verifications.push({
        status: 'bad',
        title: 'Revocation',
        description: 'This credential has been revoked.',
      });
    } else {
      result.verifications.push({
        status: 'good',
        title: 'Revocation',
        description: 'This credential has not been revoked.',
      });
    }
  }

  return result;
};
