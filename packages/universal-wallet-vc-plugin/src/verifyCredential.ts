import { verifiable } from "@transmute/vc.js";

import { VerifyCredential } from "./types";

const verifyCredential = async ({
  credential,
  options
}: VerifyCredential): Promise<any> => {
  const result = await verifiable.credential.verify({
    credential,
    suite: options.suite,
    documentLoader: options.documentLoader
  });
  return result;
};

export { verifyCredential };
