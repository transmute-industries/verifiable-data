import { createVcPayload } from "./createVcPayload";

export const createVerifiableCredential = async (
  credential: any,
  options: {
    signer: any;
    documentLoader: any;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { signer } = options;
  const payload: any = await createVcPayload(credential, options);
  const jwt = await signer.sign({ data: payload });
  return jwt;
};
