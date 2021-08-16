import { checkPresentation } from "../checkPresentation";

export const createVpPayload = async (
  presentation: any,
  options: {
    documentLoader: any;
    domain?: string;
    challenge: string;
    strict?: "ignore" | "warn" | "throw";
  }
) => {
  const { documentLoader, domain, challenge } = options;
  const strict = options.strict || "warn";

  if (!challenge) {
    throw new Error(
      '"challenge" is required to create verifiable presentations (it will be used for the "nonce" value)'
    );
  }

  await checkPresentation(presentation, {
    documentLoader,
    strict,
    domain,
    challenge
  });

  const payload: any = {};

  if (presentation.holder) {
    const holder = presentation.holder.id
      ? presentation.holder.id
      : presentation.holder;

    payload.iss = holder;
    payload.sub = holder;
  }

  payload.vp = presentation;

  if (domain) {
    payload.aud = domain;
  }

  if (challenge) {
    payload.nonce = challenge;
  }
  return payload;
};
