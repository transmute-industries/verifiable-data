import { checkPresentation } from "../checkPresentation";

export const verifyVerifiablePresentation = async (
  jwt: string,
  options: {
    aud?: string;
    nonce: string;
    verifier: any;
    documentLoader: any;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { verifier, documentLoader, aud, nonce } = options;
  const strict = options.strict || "warn";

  await checkPresentation(jwt, { documentLoader, strict, aud, nonce });
  const res = await verifier.verify({
    signature: jwt
  });
  return res;
};
