import moment from "moment";
import { checkCredential } from "../checkCredential";
export const createVerifiableCredential = async (
  credential: any,
  options: {
    signer: any;
    documentLoader: any;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { signer, documentLoader } = options;
  const strict = options.strict || "warn";

  await checkCredential(credential, { documentLoader, strict });
  const issuer =
    typeof credential.issuer === "string"
      ? credential.issuer
      : credential.issuer.id;
  const subject =
    typeof credential.credentialSubject === "string"
      ? credential.credentialSubject
      : credential.credentialSubject.id;

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
  const jwt = await signer.sign({ data: payload });
  return jwt;
};
