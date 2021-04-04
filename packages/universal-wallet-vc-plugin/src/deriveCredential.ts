import { DeriveCredential } from "./types";

const deriveCredential = ({
  verifiableCredential,
  frame,
  options
}: DeriveCredential) => {
  return options.deriveProof(verifiableCredential, frame, {
    suite: options.suite,
    documentLoader: options.documentLoader
  });
};

export { deriveCredential };
