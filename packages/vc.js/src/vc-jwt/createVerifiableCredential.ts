import moment from "moment";
// import { checkCredential } from "../checkCredential";
export const createVerifiableCredential = async (
  credential: any,
  signer: any,
  documentLoader: any,
  strict: "ignore" | "warn" | "throw" = "warn"
) => {
  // await checkCredential(credential, documentLoader, strict);
  const payload: any = {
    iss:
      typeof credential.issuer === "string"
        ? credential.issuer
        : credential.issuer.id,
    sub:
      typeof credential.credentialSubject === "string"
        ? credential.credentialSubject
        : credential.credentialSubject.id,
    vc: credential,
    jti: credential.id,
    nbf: moment(credential.issuanceDate).unix(),
  };
  if (credential.expirationDate) {
    payload.exp = moment(credential.expirationDate).unix();
  }
  console.log(documentLoader, strict);
  const jwt = await signer.sign({ data: credential });
  return jwt;
};
