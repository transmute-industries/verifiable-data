import { createVpPayload } from "./createVpPayload";

export const createVerifiablePresentation = async (
  presentation: any,
  options: {
    domain?: string;
    challenge: string;
    signer: any;
    documentLoader: any;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { signer } = options;
  const payload = await createVpPayload(presentation, options);
  const jwt = await signer.sign({ data: payload });
  return jwt;
};
