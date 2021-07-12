import { checkPresentation } from "../checkPresentation";

export const createVerifiablePresentation = async (
  presentation: any,
  options: {
    aud?: string;
    nonce: string;
    signer: any;
    documentLoader: any;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { signer, documentLoader, aud, nonce } = options;
  const strict = options.strict || "warn";

  await checkPresentation(presentation, { documentLoader, strict, aud, nonce });

  const payload: any = {};

  if (presentation.holder) {
    const holder =
      typeof presentation.holder === "string"
        ? presentation.holder
        : presentation.holder.id;
    payload.iss = holder;
    payload.sub = holder;
  }

  payload.vp = presentation;

  if (aud) {
    payload.aud = aud;
  }

  if (nonce) {
    payload.nonce = nonce;
  }

  const jwt = await signer.sign({ data: payload });
  return jwt;
};
