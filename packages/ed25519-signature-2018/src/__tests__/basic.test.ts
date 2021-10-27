import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import documentLoader from "../__fixtures__/documentLoader";
import expectedProof from "../__fixtures__/proofs/digital-bazaar/case-5.json";
import credential from "../__fixtures__/credentials/case-5.json";
let keyPair: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;
let proof: any;

describe("create and verify proof", () => {
  it("import key", async () => {
    //
    keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    expect(keyPair.controller).toBe(rawKeyJson.controller);
  });
  it("define suite", async () => {
    //
    suite = new Ed25519Signature2018({
      key: keyPair,
      date: credential.issuanceDate
    });
    expect(suite.verificationMethod).toBe(rawKeyJson.id);
  });
  it("create proof", async () => {
    //
    proof = await suite.createProof({
      document: credential,
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
      documentLoader,
      // expansionMap,
      compactProof: false
    });
  });

  it("should match fixture", () => {
    //
    expect(expectedProof).toEqual(proof);
  });

  it("verify proof", async () => {
    //
    const result = await suite.verifyProof({
      proof: expectedProof,
      document: credential,
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
      documentLoader,
      // expansionMap,
      compactProof: false
    });
    expect((expectedProof as any)["@context"]).toBeFalsy();
    expect(result.verified).toBeTruthy();
  });
});
