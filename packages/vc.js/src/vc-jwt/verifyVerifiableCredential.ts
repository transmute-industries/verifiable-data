import { checkCredential } from "../checkCredential";

export const verifyVerifiableCredential = async (
  jwt: string,
  options: {
    verifier: any;
    documentLoader: any;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { verifier, documentLoader } = options;
  const strict = options.strict || "warn";

  await checkCredential(jwt, { documentLoader, strict });
  const res = await verifier.verify({
    signature: jwt
  });
  return res;
};
