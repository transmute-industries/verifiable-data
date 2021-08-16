import { BbsBlsSignatureProof2020 } from "./BbsBlsSignatureProof2020";
import { verifiableCredentials, frames, documentLoader } from "./__fixtures__";

const suite = new BbsBlsSignatureProof2020();

let derivedProof: any;
let derivedDocument: any;

it("can derive", async () => {
  const { proof, ...document } = verifiableCredentials.verifiableCredential0;

  const result = await suite.deriveProof({
    document: document,
    proof: proof,
    revealDocument: frames.frame0,
    documentLoader
  });

  derivedDocument = result.document;
  derivedProof = result.proof;

  expect(derivedDocument).toBeDefined();
  expect(derivedProof).toBeDefined();
});

it("can verify derived proof", async () => {
  const result = await suite.verifyProof({
    document: derivedDocument,
    proof: derivedProof,
    purpose: {
      // ignore validation of dates and such...
      validate: () => {
        return { valid: true };
      },
      update: (proof: any) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      }
    },
    documentLoader
  });
  expect(result.verified).toBe(true);
});
