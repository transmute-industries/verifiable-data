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

// 4
import credentialRemoved from "../__fixtures__/credentials/case-11.json";
import expectedProofRemoved from "../__fixtures__/proofs/digital-bazaar/case-11.json";

// 5
import credentialUnix from "../__fixtures__/credentials/case-12.json";
import expectedProofUnix from "../__fixtures__/proofs/digital-bazaar/case-12.json";

// 6
import credentialNegOne from "../__fixtures__/credentials/case-14.json";
import expectedProofNegOne from "../__fixtures__/proofs/digital-bazaar/case-14.json";

// 7
import credentialEmpty from "../__fixtures__/credentials/case-15.json";
import expectedProofEmpty from "../__fixtures__/proofs/digital-bazaar/case-15.json";

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

const expectProofsToBeSimilar = async (credential: any, expectedProof: any) => {
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

  const outParts = proof.created.split("");
  outParts[17] = "x";
  outParts[18] = "x";
  let expectedParts = expectedProof.created.split("");
  expectedParts[17] = "x";
  expectedParts[18] = "x";
  expect(outParts.join("")).toEqual(expectedParts.join(""));

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

  it("1. issueDate as iso string", async () => {
    // Expected behavior is that proofs should use
    // existing ISO string as is
    await expectProofsToMatch(credentialISO, expectedProofISO);
  });

  it("2. issueDate as xml string", async () => {
    // Expected behavior is that proofs should use
    // existing XML string as is
    await expectProofsToMatch(credentialXML, expectedProofXML);
  });

  it("3. issueDate when null", async () => {
    // Expected behavior is that proofs should use
    // 1970-01-01T00:00:00Z as the date
    await expectProofsToMatch(credentialNull, expectedProofNull);
  });

  it("4. issueDate term is removed", async () => {
    // Expected behavior is that date should be created
    // with current time in format 2021-10-27T14:58:16Z
    await expectProofsToBeSimilar(credentialRemoved, expectedProofRemoved);
  });

  it("5. issueDate is a unix timestamp", async () => {
    // Expected behavior is that proofs should be
    // converted to 2021-10-27T12:39:01Z format
    await expectProofsToMatch(credentialUnix, expectedProofUnix);
  });

  it("6. issueDate is negative one", async () => {
    // Expected behavior is that proofs should be
    // converted to 1969-12-31T23:59:59Z format
    await expectProofsToMatch(credentialNegOne, expectedProofNegOne);
  });

  it("7. issueDate is empty string", async () => {
    // Expected behavior is that proofs should
    // pass through the empty string as-is
    await expectProofsToMatch(credentialEmpty, expectedProofEmpty);
  });
});
