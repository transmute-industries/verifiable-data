import { BbsBlsSignatureProof2020 } from "./BbsBlsSignatureProof2020";
import { verifiableCredentials, frames, documentLoader } from "./__fixtures__";

const suite = new BbsBlsSignatureProof2020();

it("can derive", async () => {
  const { proof, ...document } = verifiableCredentials.verifiableCredential0;

  const result = await suite.deriveProof({
    document: document,
    proof: proof,
    revealDocument: frames.frame0,
    documentLoader,
  });

  console.log("", result);
});
