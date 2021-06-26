import { ld } from "@transmute/vc.js";

import { PresentCredentials } from "./types";

const vcjs = ld;

const createVerifiablePresentation = ({
  presentation,
  verifiableCredential,
  options,
}: PresentCredentials) => {
  // remember the context must cover the proof suite...
  if (!presentation) {
    presentation = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      holder: options.holder,
      verifiableCredential,
    };
  }

  return vcjs.signPresentation({
    presentation,
    suite: options.suite,
    challenge: options.challenge,
    domain: options.domain,
    documentLoader: options.documentLoader,
  });
};

export { createVerifiablePresentation };
