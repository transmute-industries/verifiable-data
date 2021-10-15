import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import rawKeyJson from "../__fixtures__/key.json";
import documentLoader from "../__fixtures__/documentLoader";
import expectedProof from "../__fixtures__/proof.json";

let keyPair: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;
let proof: any;
const credential = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  id: "https://example.com/credentials/1872",
  type: ["VerifiableCredential"],
  issuer: rawKeyJson.controller,
  issuanceDate: "2010-01-01T19:23:24Z",
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
  },
};
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
      date: credential.issuanceDate,
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
        },
      },
      documentLoader,
      // expansionMap,
      compactProof: false,
    });
  });

  it("verify proof", async () => {
    //
    const result = await suite.verifyProof({
      proof: { ...proof, "@context": credential["@context"] },
      document: credential,
      purpose: {
        // ignore validation of dates and such...
        validate: () => {
          return { valid: true };
        },
        update: (proof: any) => {
          proof.proofPurpose = "assertionMethod";
          return proof;
        },
      },
      documentLoader,
      // expansionMap,
      compactProof: false,
    });
    expect(result.verified).toBeTruthy();
  });
  it("should match fixture", () => {
    //
    expect(expectedProof).toEqual(proof);
  });
});
