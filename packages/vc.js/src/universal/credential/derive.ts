import { DeriveCredentialOptions, DeriveCredentialResult } from "../../types";

export const derive = async (
  options: DeriveCredentialOptions
): Promise<DeriveCredentialResult> => {
  const result: DeriveCredentialResult = {
    items: []
  };

  if (!options.format) {
    options.format = ["vc"];
  }

  const { credential, frame, suite, documentLoader } = options;

  const { proof, ...document } = credential;

  if (!suite.deriveProof) {
    throw new Error("Suite requires deriveProof");
  }

  const derivationResult = await suite.deriveProof({
    document: document,
    proof: { ...proof, "@context": document["@context"] },
    revealDocument: frame,
    documentLoader
  });
  const derivedCredential = {
    ...derivationResult.document,
    proof: derivationResult.proof
  };
  delete derivedCredential.proof["@context"];
  result.items.push(derivedCredential);
  return result;
};
