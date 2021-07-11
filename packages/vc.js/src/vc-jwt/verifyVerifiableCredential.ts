import { checkCredential } from "../checkCredential";

export const verifyVerifiableCredential = async (
  jwt: string,
  verifier: any,
  documentLoader: any,
  strict: "ignore" | "warn" | "throw" = "warn"
) => {
  await checkCredential(jwt, documentLoader, strict);

  const res = await verifier.verify({
    signature: jwt,
  });
  console.log(res);
  return true;
};
