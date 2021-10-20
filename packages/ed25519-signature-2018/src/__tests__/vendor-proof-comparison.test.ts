import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import vc from "../__fixtures__/vcs/mavennet-vc.json";
import rawKeyJson from "../__fixtures__/key.json";
import documentLoader from "../__fixtures__/documentLoader";
import digitalBazaarProof from "../__fixtures__/proof2.json";

const credential = JSON.parse(JSON.stringify(vc));
delete credential.proof;

describe("proof is same", () => {
  it("creates proof", async () => {
    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    expect(keyPair.controller).toBe(rawKeyJson.controller);
    const suite = new Ed25519Signature2018({
      key: keyPair,
      date: "2021-10-19T19:47:38Z"
    });
    expect(suite.verificationMethod).toBe(rawKeyJson.id);
    const proof = await suite.createProof({
      document: credential,
      purpose: {
        validate: () => {
          return { valid: true };
        },
        update: (proof: any) => {
          proof.proofPurpose = "assertionMethod";
          return proof;
        }
      },
      documentLoader,
      compactProof: false
    });
    expect(proof).toEqual(digitalBazaarProof);
    const result = await suite.verifyProof({
      proof: proof,
      document: credential,
      purpose: {
        validate: () => {
          return { valid: true };
        },
        update: (proof: any) => {
          proof.proofPurpose = "assertionMethod";
          return proof;
        }
      },
      documentLoader,
      compactProof: false
    });
    expect(result.verified).toBeTruthy();
  });
});
