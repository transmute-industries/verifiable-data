import { ld } from "@transmute/vc.js";

import { VerifyPresentation } from "./types";

const vcjs = ld;

const verifyPresentation = ({ presentation, options }: VerifyPresentation) => {
  let opts = {
    ...options,
  };
  if (presentation.proof) {
    opts = {
      presentation,
      ...opts,
    };
  } else {
    opts = {
      unsignedPresentation: presentation,
      ...opts,
    };
  }
  return vcjs.verify(opts);
};

export { verifyPresentation };
