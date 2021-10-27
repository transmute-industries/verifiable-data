import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import documentLoader from "../__fixtures__/documentLoader";

// Test 1 "issuanceDate": "2021-10-19T14:47:38-05:00"
import credentialISO from "../__fixtures__/credentials/case-7.json";
import expectedProofISO from "../__fixtures__/proofs/digital-bazaar/case-7.json";

// Test 2 "issuanceDate": "2021-10-19T19:47:38Z"
import credentialXML from "../__fixtures__/credentials/case-8.json";
import expectedProofXML from "../__fixtures__/proofs/digital-bazaar/case-8.json";

// Test 3 "issuanceDate": null
import credentialNull from "../__fixtures__/credentials/case-9.json";
import expectedProofNull from "../__fixtures__/proofs/digital-bazaar/case-9.json";

// Test 4 "issuanceDate": (term does not exist in credential)
import credentialRemoved from "../__fixtures__/credentials/case-10.json";
import expectedProofRemoved from "../__fixtures__/proofs/digital-bazaar/case-10.json";

// Test 5 "issuanceDate": 1635338341313
import credentialUnix from "../__fixtures__/credentials/case-11.json";
import expectedProofUnix from "../__fixtures__/proofs/digital-bazaar/case-11.json";

// Test 6 "issuanceDate": -1
import credentialNegOne from "../__fixtures__/credentials/case-12.json";
import expectedProofNegOne from "../__fixtures__/proofs/digital-bazaar/case-12.json";

// Test 7 "issuanceDate": ""
import credentialEmpty from "../__fixtures__/credentials/case-13.json";
import expectedProofEmpty from "../__fixtures__/proofs/digital-bazaar/case-13.json";

// Test 8 "issuanceDate": "04 Dec 1995 00:12:00 GMT"
import credentialGMT from "../__fixtures__/credentials/case-14.json";
import expectedProofGMT from "../__fixtures__/proofs/digital-bazaar/case-14.json";

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

const diffInSeconds = (dateA: string, dateB: string): number => {
  return Math.floor(
    Math.abs(new Date(dateA).getTime() - new Date(dateB).getTime()) / 1000
  );
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
    compactProof: false
  });

  const xmlDatetime = new RegExp(
    "^([0-9]{4})-([0-1][0-9])-([0-3][0-9]T[0-2][0-9]:[0-6][0-9]:[0-6][0-9](Z)?)$"
  );
  // Created Proof Should be XML Datetime
  expect(xmlDatetime.test(proof.created)).toBeTruthy();
  // Expected Proof should be XML Datetime
  expect(xmlDatetime.test(expectedProof.created)).toBeTruthy();
  // Should be less than 10 seconds apart
  expect(diffInSeconds(proof.created, expectedProof.created)).toBeLessThan(10);

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

describe("regarding issuanceDate Handling", () => {
  it("import key", async () => {
    keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    expect(keyPair.controller).toBe(rawKeyJson.controller);
  });

  it("1. issuanceDate as iso string", async () => {
    // Expected behavior is that proofs should use
    // existing ISO string as is
    await expectProofsToMatch(credentialISO, expectedProofISO);
  });

  it("2. issuanceDate as xml string", async () => {
    // Expected behavior is that proofs should use
    // existing XML string as is
    await expectProofsToMatch(credentialXML, expectedProofXML);
  });

  it("3. issuanceDate when null", async () => {
    // Expected behavior is that proofs should use
    // 1970-01-01T00:00:00Z as the date
    await expectProofsToMatch(credentialNull, expectedProofNull);
  });

  it("4. issuanceDate term is removed", async () => {
    // Expected behavior is that date should be created
    // with current time in format 2021-10-27T14:58:16Z
    await expectProofsToBeSimilar(credentialRemoved, expectedProofRemoved);
  });

  it("5. issuanceDate is a unix timestamp", async () => {
    // Expected behavior is that proofs should be
    // converted to 2021-10-27T12:39:01Z format
    await expectProofsToMatch(credentialUnix, expectedProofUnix);
  });

  it("6. issuanceDate is negative one", async () => {
    // Expected behavior is that proofs should be
    // converted to 1969-12-31T23:59:59Z format
    await expectProofsToMatch(credentialNegOne, expectedProofNegOne);
  });

  it("7. issuanceDate is empty string", async () => {
    // Expected behavior is that proofs should
    // pass through the empty string as-is
    await expectProofsToMatch(credentialEmpty, expectedProofEmpty);
  });

  it("8. issuanceDate is GMT date time", async () => {
    // Expected behavior is that proofs should
    // pass through the empty string as-is
    await expectProofsToMatch(credentialGMT, expectedProofGMT);
  });
});
