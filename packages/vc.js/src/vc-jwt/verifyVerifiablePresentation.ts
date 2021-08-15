import { checkPresentation } from "../checkPresentation";

export const verifyVerifiablePresentation = async (
  jwt: string,
  options: {
    domain?: string;
    challenge: string;
    verifier: any;
    documentLoader: any;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { verifier, documentLoader, domain, challenge } = options;
  const strict = options.strict || "warn";

  await checkPresentation(jwt, { documentLoader, strict, domain, challenge });
  const res = await verifier.verify({
    signature: jwt
  });
  return res;
};
