import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import documentLoader from "../__fixtures__/documentLoader";

// "issuanceDate": "2021-10-19T14:47:38-05:00"
import credentialISO from "../__fixtures__/credentials/case-7.json";
import expectedProofISO from "../__fixtures__/proofs/digital-bazaar/case-7.json";

// "issuanceDate": "2021-10-19T19:47:38Z"
import credentialXML from "../__fixtures__/credentials/case-8.json";
import expectedProofXML from "../__fixtures__/proofs/digital-bazaar/case-8.json";

// "issuanceDate": null
import credentialNull from "../__fixtures__/credentials/case-9.json";
import expectedProofNull from "../__fixtures__/proofs/digital-bazaar/case-9.json";

// "issuanceDate": (term does not exist in credential)
import credentialRemoved from "../__fixtures__/credentials/case-10.json";
import expectedProofRemoved from "../__fixtures__/proofs/digital-bazaar/case-10.json";

// "issuanceDate": 1635338341313
import credentialUnix from "../__fixtures__/credentials/case-11.json";
import expectedProofUnix from "../__fixtures__/proofs/digital-bazaar/case-11.json";

// "issuanceDate": -1
import credentialNegOne from "../__fixtures__/credentials/case-12.json";
import expectedProofNegOne from "../__fixtures__/proofs/digital-bazaar/case-12.json";

// "issuanceDate": ""
import credentialEmpty from "../__fixtures__/credentials/case-13.json";
import expectedProofEmpty from "../__fixtures__/proofs/digital-bazaar/case-13.json";

// "issuanceDate": "04 Dec 1995 00:12:00 GMT"
import credentialGMT from "../__fixtures__/credentials/case-14.json";
import expectedProofGMT from "../__fixtures__/proofs/digital-bazaar/case-14.json";

// "issuanceDate": undefined
import credentialUndefined from "../__fixtures__/credentials/case-15.json";
import expectedProofUndefined from "../__fixtures__/proofs/digital-bazaar/case-15.json";

// "issuanceDate": -5299144972
import credentialNeg from "../__fixtures__/credentials/case-16.json";
import expectedProofNeg from "../__fixtures__/proofs/digital-bazaar/case-16.json";

// "issuanceDate": 123
import credential123 from "../__fixtures__/credentials/case-17.json";
import expectedProof123 from "../__fixtures__/proofs/digital-bazaar/case-17.json";

// "issuanceDate": 12345
import credential12345 from "../__fixtures__/credentials/case-18.json";
import expectedProof12345 from "../__fixtures__/proofs/digital-bazaar/case-18.json";

// "issuanceDate": -123
import credentialNeg123 from "../__fixtures__/credentials/case-19.json";
import expectedProofNeg123 from "../__fixtures__/proofs/digital-bazaar/case-19.json";

// "issuanceDate": -12345
import credentialNeg12345 from "../__fixtures__/credentials/case-20.json";
import expectedProofNeg12345 from "../__fixtures__/proofs/digital-bazaar/case-20.json";

// "issuanceDate": 0
import credentialZero from "../__fixtures__/credentials/case-21.json";
import expectedProofZero from "../__fixtures__/proofs/digital-bazaar/case-21.json";

// "issuanceDate": "10 06 2014"
import credentialMonDayYear from "../__fixtures__/credentials/case-22.json";
import expectedProofMonDayYear from "../__fixtures__/proofs/digital-bazaar/case-22.json";

// "issuanceDate": "2019-05-30"
import credentialYearMonDay from "../__fixtures__/credentials/case-23.json";
import expectedProofYearMonDay from "../__fixtures__/proofs/digital-bazaar/case-23.json";

// "issuanceDate": "2019-05-30T01:23:45.678Z"
import credentialXmlMs from "../__fixtures__/credentials/case-24.json";
import expectedProofXmlMs from "../__fixtures__/proofs/digital-bazaar/case-24.json";

// "issuanceDate": "2019-01-01T01:33:44.456+09:00"
import credentialTMs from "../__fixtures__/credentials/case-25.json";
import expectedProofTMs from "../__fixtures__/proofs/digital-bazaar/case-25.json";

// "issuanceDate": "2021-04-19T01:23:45"
import credentialNoTZ from "../__fixtures__/credentials/case-26.json";
import expectedProofNoTZ from "../__fixtures__/proofs/digital-bazaar/case-26.json";

// "issuanceDate": "Aug 9, 1995"
import credentialMonth from "../__fixtures__/credentials/case-27.json";
import expectedProofMonth from "../__fixtures__/proofs/digital-bazaar/case-27.json";

// "issuanceDate": "Wed, 09 Aug 1995 00:00:00"
import credentialMonthNoTZ from "../__fixtures__/credentials/case-28.json";
import expectedProofMonthNoTZ from "../__fixtures__/proofs/digital-bazaar/case-28.json";

// "issuanceDate": 0
import credentialOne from "../__fixtures__/credentials/case-29.json";
import expectedProofOne from "../__fixtures__/proofs/digital-bazaar/case-29.json";

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

describe("1. proof should create XML datetime for missing issuanceDate", () => {
  // Import Key before starting (async)
  (async () => {
    keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
  })();

  it("1.1 issuanceDate is null", async () => {
    await expectProofsToBeSimilar(credentialNull, expectedProofNull);
  });

  it("1.2 issuanceDate term is not in credential", async () => {
    await expectProofsToBeSimilar(credentialRemoved, expectedProofRemoved);
  });

  it("1.3 issuanceDate is empty string", async () => {
    await expectProofsToBeSimilar(credentialEmpty, expectedProofEmpty);
  });

  it("1.4 issuanceDate is undefined", async () => {
    // TypeScript ignore line is required to run test for undefined
    // @ts-ignore
    credentialUndefined.issuanceDate = undefined;
    await expectProofsToBeSimilar(credentialUndefined, expectedProofUndefined);
  });

  it("1.5 issuanceDate is zero ", async () => {
    await expectProofsToBeSimilar(credentialZero, expectedProofZero);
  });
});

describe("2. proof should give same XML datetime for given issuanceDate int", () => {
  it("2.1 issuanceDate is 1635338341313", async () => {
    await expectProofsToMatch(credentialUnix, expectedProofUnix);
  });

  it("2.2 issuanceDate is -1635338341313", async () => {
    await expectProofsToMatch(credentialNeg, expectedProofNeg);
  });

  it("2.3 issuanceDate is 1", async () => {
    await expectProofsToMatch(credentialOne, expectedProofOne);
  });

  it("2.4 issuanceDate is -1", async () => {
    await expectProofsToMatch(credentialNegOne, expectedProofNegOne);
  });

  it("2.5 issuanceDate is 123", async () => {
    await expectProofsToMatch(credential123, expectedProof123);
  });

  it("2.6 issuanceDate is 12345", async () => {
    await expectProofsToMatch(credential12345, expectedProof12345);
  });

  it("2.7 issuanceDate is -123", async () => {
    await expectProofsToMatch(credentialNeg123, expectedProofNeg123);
  });

  it("2.8 issuanceDate is -12345", async () => {
    await expectProofsToMatch(credentialNeg12345, expectedProofNeg12345);
  });
});

describe("3. proof should give same XML datetime for given issuanceDate string", () => {
  it("3.1 issuanceDate is '2021-10-19T14:47:38-05:00' (ISO)", async () => {
    await expectProofsToMatch(credentialISO, expectedProofISO);
  });

  it("3.2 issuanceDate is '2021-10-19T19:47:38Z' (XML)", async () => {
    await expectProofsToMatch(credentialXML, expectedProofXML);
  });

  it("3.3 issuanceDate is '04 Dec 1995 00:12:00 GMT'", async () => {
    await expectProofsToMatch(credentialGMT, expectedProofGMT);
  });

  it("3.4 issuanceDate is '10 06 2014' ", async () => {
    await expectProofsToMatch(credentialMonDayYear, expectedProofMonDayYear);
  });

  it("3.5 issuanceDate is '2019-05-30' ", async () => {
    await expectProofsToMatch(credentialYearMonDay, expectedProofYearMonDay);
  });

  it("3.6 issuanceDate is '2019-05-30T01:23:45.678Z' ", async () => {
    await expectProofsToMatch(credentialXmlMs, expectedProofXmlMs);
  });

  it("3.7 issuanceDate is '2019-01-01T01:33:44.456+09:00' ", async () => {
    await expectProofsToMatch(credentialTMs, expectedProofTMs);
  });

  it("3.8 issuanceDate is '2021-04-19T01:23:45' ", async () => {
    await expectProofsToMatch(credentialNoTZ, expectedProofNoTZ);
  });

  it("3.9 issuanceDate is 'Aug 9, 1995' ", async () => {
    await expectProofsToMatch(credentialMonth, expectedProofMonth);
  });

  it("3.10 issuanceDate is 'Wed, 09 Aug 1995 00:00:00' ", async () => {
    await expectProofsToMatch(credentialMonthNoTZ, expectedProofMonthNoTZ);
  });
});
