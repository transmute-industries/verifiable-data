import moment from "moment";
import { checkCredential } from "../checkCredential";

export const createVcPayload = async (
  credential: any,
  options: {
    documentLoader: any;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { documentLoader } = options;
  const strict = options.strict || "warn";

  if (!credential.issuer) {
    throw new Error("Issuer is a required field.");
  }

  await checkCredential(credential, { documentLoader, strict });

  const issuer = credential.issuer.id
    ? credential.issuer.id
    : credential.issuer;
  let subject = undefined;
  if (
    typeof credential.credentialSubject === "string" ||
    credential.credentialSubject instanceof String
  ) {
    subject = credential.credentialSubject;
  }
  if (
    typeof credential.credentialSubject === "object" &&
    credential.credentialSubject !== null &&
    credential.credentialSubject.id
  ) {
    subject = credential.credentialSubject.id;
  }
  const payload: any = {
    iss: issuer,
    sub: subject,
    vc: credential,
    jti: credential.id,
    nbf: moment(credential.issuanceDate).unix()
  };
  if (credential.expirationDate) {
    payload.exp = moment(credential.expirationDate).unix();
  }
  return payload;
};
