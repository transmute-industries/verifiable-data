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
  const subject = credential.credentialSubject.id
    ? credential.credentialSubject.id
    : credential.credentialSubject;
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
