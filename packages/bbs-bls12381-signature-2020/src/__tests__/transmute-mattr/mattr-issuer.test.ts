import * as help from "../../__fixtures__/test-help";
import * as fixtures from "../../__fixtures__";
import mattr from "../../__fixtures__/test-mattr";
import transmute from "../../__fixtures__/test-transmute";

let suite1: any;
const document1 = { ...fixtures.credentials.credential0 };
let document2: any;

let proof1: any;
let proof2: any;

beforeAll(async () => {
  suite1 = await help.getSuite(
    fixtures.keys.key1,
    mattr.Bls12381G2KeyPair,
    mattr.BbsBlsSignature2020
  );
});

it("mattr issue", async () => {
  proof1 = await suite1.createProof({
    document: { ...document1 },
    purpose: {
      update: (proof: any) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      }
    },
    documentLoader: fixtures.documentLoader,
    compactProof: true
  });
  expect(proof1).toBeDefined();
});
it("transmute verify", async () => {
  const suite = new transmute.BbsBlsSignature2020();
  const result = await suite.verifyProof({
    document: { ...document1 },
    proof: { ...proof1 },
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
    documentLoader: fixtures.documentLoader
  });
  expect(result.verified).toBe(true);
});

it("mattr derive", async () => {
  const suite = new mattr.BbsBlsSignatureProof2020();
  const result: any = await suite.deriveProof({
    document: { ...document1 },
    proof: { ...proof1 },
    revealDocument: fixtures.frames.frame0,
    documentLoader: fixtures.documentLoader
  });
  document2 = result.document;
  proof2 = result.proof;
  expect(document2).toBeDefined();
  expect(proof2).toBeDefined();
});

it("transmute verify", async () => {
  delete proof2["@context"];
  proof2.type = "BbsBlsSignatureProof2020";
  const suite = new transmute.BbsBlsSignatureProof2020();
  const result = await suite.verifyProof({
    document: document2,
    proof: { ...proof2, "@context": document2["@context"] },
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
    documentLoader: fixtures.documentLoader
  });
  expect(result.verified).toBe(true);
});
