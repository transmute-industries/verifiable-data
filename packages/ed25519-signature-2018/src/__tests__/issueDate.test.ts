import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import documentLoader from "../__fixtures__/documentLoader";

// 1
import credentialISO from "../__fixtures__/credentials/case-7.json";
import expectedProofISO from "../__fixtures__/proofs/digital-bazaar/case-7.json";

// 2
import credentialXML from "../__fixtures__/credentials/case-8.json";
import expectedProofXML from "../__fixtures__/proofs/digital-bazaar/case-8.json";

// 3
import credentialNull from "../__fixtures__/credentials/case-10.json";
import expectedProofNull from "../__fixtures__/proofs/digital-bazaar/case-10.json";

let keyPair: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;
let proof: any;

const expectProofsToMatch = async (credential: any, expectedProof: any) => {
  suite = new Ed25519Signature2018({
    key: keyPair,
    date: credential.issuanceDate
  });

  proof = await suite.createProof({
    document: credential,
    purpose: {
      // ignore validation of dates and such...
      validate: () => {
        return {
          valid: true
        };
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

  const result = await suite.verifyProof({
    proof: proof,
    document: credential,
    purpose: {
      // ignore validation of dates and such...
      validate: () => {
        return {
          valid: true
        };
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
};

describe("regarding isseuDate Handling", () => {
  it("import key", async () => {
    keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    expect(keyPair.controller).toBe(rawKeyJson.controller);
  });

  it("1. isseuDate as iso string", async () => {
    await expectProofsToMatch(credentialISO, expectedProofISO);
  });

  it("2. isseuDate as xml string", async () => {
    await expectProofsToMatch(credentialXML, expectedProofXML);
  });

  it("3. isseuDate when null", async () => {
    await expectProofsToMatch(credentialNull, expectedProofNull);
  });
});
