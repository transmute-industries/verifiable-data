import { verifiable } from "@transmute/vc.js";
import { checkStatus } from "@transmute/vc-status-rl-2020";
import { VerifyPresentation } from "./types";

const verifyPresentation = async ({
  presentation,
  options
}: VerifyPresentation): Promise<any> => {
  let opts = {
    ...options,
    checkStatus
  };
  if (presentation.proof) {
    opts = {
      presentation,
      ...opts
    };
  } else {
    opts = {
      unsignedPresentation: presentation,
      ...opts
    };
  }
  const result = await verifiable.presentation.verify(opts);
  return result;
};

export { verifyPresentation };
