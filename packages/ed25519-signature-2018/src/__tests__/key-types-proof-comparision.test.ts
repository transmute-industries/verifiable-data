import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import rawKeyJson2 from "../__fixtures__/keys/key2.json";
import documentLoader from "../__fixtures__/documentLoader";
import expectedProof from "../__fixtures__/proofs/digital-bazaar/case-2.json";
import credential from "../__fixtures__/credentials/case-2.json";

let keyPair: Ed25519VerificationKey2018;
let keyPair2: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;
let suite2: Ed25519Signature2018;
let proof: any;
let proof2: any;

describe("proof same with different key type", () => {
  it("import key", async () => {
    keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    keyPair2 = await Ed25519VerificationKey2018.from(rawKeyJson2);
    expect(keyPair.controller).toBe(rawKeyJson.controller);
    expect(keyPair2.controller).toBe(rawKeyJson.controller);
  });

  it("define suite", async () => {
    suite = new Ed25519Signature2018({
      key: keyPair,
      date: credential.issuanceDate
    });
    suite2 = new Ed25519Signature2018({
      key: keyPair2,
      date: credential.issuanceDate
    });
    expect(suite.verificationMethod).toBe(rawKeyJson.id);
    expect(suite2.verificationMethod).toBe(rawKeyJson.id);
  });
  it("create proof", async () => {
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
    proof2 = await suite2.createProof({
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
    expect(proof).toEqual(expectedProof);
    expect(proof2).toEqual(expectedProof);
  });
});
