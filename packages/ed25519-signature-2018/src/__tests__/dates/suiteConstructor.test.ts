/**
 * In this test we want to confirm how issuanceDate values are
 * handled when irregular or incrrect values are provided to the
 * suite when signed.
 * In this test we will confirm the operation of Transmute's
 * libraries using fixtures generated from Digital Bazaar's library
 **/

import undefinedSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-1.json";
import nullSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-2.json";
import zeroSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-3.json";
import emptyStringSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-4.json";
import foobarStringSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-5.json";
import timestamp0SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-6.json";
import timestamp1SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-7.json";
import timestamp2SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-8.json";
import timestamp3SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-9.json";
import timestamp4SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-10.json";
import timestamp5SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-11.json";
import timestamp6SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-12.json";
import timestamp7SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-13.json";
import dateString1SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-15.json";
import dateString2SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-16.json";
import dateString10SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-24.json";
import dateString0SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-14.json";
import dateString3SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-17.json";
import dateString4SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-18.json";
import dateString5SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-19.json";
import dateString6SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-20.json";
import dateString7SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-21.json";
import dateString8SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-22.json";
import dateString9SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-23.json";
import dateString11SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-25.json";
import dateString12SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-26.json";
import dateString13SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-27.json";

import {
  issuedOn,
  createCredential,
  createSuite,
  signCredential,
  isDateValidXmlSchema,
  verifyProof
} from "./date-utils";

const undefinedDates = [
  {
    condition: undefined,
    fixture: undefinedSuiteFixture
  },
  {
    condition: null,
    fixture: nullSuiteFixture
  },
  {
    condition: 0,
    fixture: zeroSuiteFixture
  },
  {
    condition: '',
    fixture: emptyStringSuiteFixture
  },
];

const invalidDates = [
  {
    condition: 'foobar',
    fixture: foobarStringSuiteFixture
  },
  {
    condition: 'Sunday, August 25th 1991, 9:33:56 pm',
    fixture: dateString1SuiteFixture
  },
  {
    condition: '25th Sunday August 1991',
    fixture: dateString2SuiteFixture
  },
  {
    condition: '1991-08-25T21:33:56:789+09:00',
    fixture: dateString10SuiteFixture
  }
]

const exactDates = [
  {
    condition: 1635774995208,
    fixture: timestamp0SuiteFixture
  },
  {
    condition: -1635774995208,
    fixture: timestamp1SuiteFixture
  },
  {
    condition: 1,
    fixture: timestamp2SuiteFixture
  },
  {
    condition: -1,
    fixture: timestamp3SuiteFixture
  },
  {
    condition: 123,
    fixture: timestamp4SuiteFixture
  },
  {
    condition: -123,
    fixture: timestamp5SuiteFixture
  },
  {
    condition: 12345,
    fixture: timestamp6SuiteFixture
  },
  {
    condition: -12345,
    fixture: timestamp7SuiteFixture
  },
  {
    condition: '1991-08-25T21:33:56+09:00',
    fixture: dateString0SuiteFixture
  },
  {
    condition: 'Sunday August 25, 1991',
    fixture: dateString3SuiteFixture
  },
  {
    condition: '25 Aug 1991',
    fixture: dateString4SuiteFixture
  },
  {
    condition: '1991-08-25',
    fixture: dateString5SuiteFixture
  },
  {
    condition: 'Sun, 25 Aug 1991 21:33:56',
    fixture: dateString6SuiteFixture
  },
  {
    condition: '08 25 1991',
    fixture: dateString7SuiteFixture
  },
  {
    condition: 'Aug 25, 1991',
    fixture: dateString8SuiteFixture
  },
  {
    condition: '1991-08-25T21:33:56',
    fixture: dateString9SuiteFixture
  },
  {
    condition: '1991-08-25T21:33:56Z',
    fixture: dateString11SuiteFixture
  },
  {
    condition: '1991-08-25T21:33+09:00',
    fixture: dateString12SuiteFixture
  },
  {
    condition: '1991-08-25T12:33:56.789Z',
    fixture: dateString13SuiteFixture
  }
]

const testUndefinedDatesThatCauseNewIssueDate = async (condition: Condition, fixture: CredentialType) => {
  // Create a suite using undefined for the date parameter that gets passed into the suite
  const { suite, suiteError } = await createSuite(condition);

  // There will be no error, the date attribute on suite will be undefined
  expect(suite).toBeDefined();
  expect(suite!.date).toBeUndefined();
  expect(suiteError).toBeUndefined();

  // Create a valid credential to be signed
  const credential = createCredential(issuedOn);

  // Sign the valid credential with undefined date suite
  const { proof, signError } = await signCredential(suite!, credential);
  expect(proof).toBeDefined();
  credential.proof = proof;

  // Specifically the created attribute should be the current time
  expect(proof!.created).toBeDefined();
  expect(signError).toBeUndefined();

  // Compare against fixture result, we expect a proof
  expect(fixture.proof).toBeDefined();
  // And the created attribute for the proof is the time the fixture was generated
  expect(fixture.proof!.created).toBeDefined();

  // Both Transmute and Digital Bazaar should have valid dates
  expect(isDateValidXmlSchema(proof!.created)).toBeTruthy();
  expect(
    isDateValidXmlSchema(fixture.proof!.created)
  ).toBeTruthy();

  // We expect the proofs to verify for both our credential and for the digital bazaar fixture
  expect((await verifyProof(credential)).verified).toBeTruthy();
  expect((await verifyProof(fixture)).verified).toBeTruthy();
}

const testInvalidDatesThatCauseErrorOnSuite = async (condition: Condition, fixture: DateErrorType) => {
  // Create a suite using foobar for the date parameter that gets passed into the suite
  const { suite, suiteError } = await createSuite(condition);

  // There will be error, so the suite should be undefined
  expect(suite).toBeUndefined();
  // We expect the suite error to be defined, and we expect the type to be 'error'
  expect(suiteError).toBeDefined();
  expect(suiteError!.type).toBe("error");

  // We expect the fixture to also be an error
  expect(fixture.type).toBe("error");

  // We expect both our library and digital bazaar's library to have thrown on suite
  expect(suiteError!.thrownOn).toBe("suite");
  expect(foobarStringSuiteFixture.thrownOn).toBe("suite");
}

const testSpecificDateWhichProducesFixedResult = async (condition: Condition, fixture: CredentialType) => {
  const { suite, suiteError } = await createSuite(condition);
  expect(suite).toBeDefined();
  expect(suite!.date).toBeDefined();
  expect(suiteError).toBeUndefined();

  // Create a valid credential to be signed
  const credential = createCredential(issuedOn);

  // Sign the valid credential with undefined date suite
  const { proof, signError } = await signCredential(suite!, credential);
  expect(proof).toBeDefined();
  credential.proof = proof;

  // Specifically the created attribute should be the current time
  expect(proof!.created).toBeDefined();
  expect(signError).toBeUndefined();

  // Compare against fixture result, we expect a proof
  expect(fixture.proof).toBeDefined();
  // And the created attribute for the proof is the same as the one we generated
  expect(fixture.proof!.created).toBe(proof!.created);

  // Both Transmute and Digital Bazaar should have valid dates
  expect(isDateValidXmlSchema(proof!.created)).toBeTruthy();
  expect(isDateValidXmlSchema(fixture.proof!.created)).toBeTruthy();

  // We expect the proofs to verify for both our credential and for the fixture
  expect((await verifyProof(credential)).verified).toBeTruthy();
  expect((await verifyProof(fixture)).verified).toBeTruthy();
}

describe("Handling undefined date value provided into suite", () => {

  // Pattern 1, undefined date provided into suite
  for (let i = 0; i < undefinedDates.length; i++) {
    const { condition, fixture } = undefinedDates[i];
    it(`${i}) should create suite with an ${condition} date`, async () => {
      await testUndefinedDatesThatCauseNewIssueDate(condition, fixture);
    });
  }

  // Pattern 2, invalid date value causes error to be thrown
  for (let i = 0; i < invalidDates.length; i++) {
    const { condition, fixture } = invalidDates[i];
    it(`${i}) should create suite with an ${condition} date`, async () => {
      await testInvalidDatesThatCauseErrorOnSuite(condition, fixture);
    });
  }

  // Pattern 3, produces a proof with a specific created value
  for (let i = 0; i < exactDates.length; i++) {
    const { condition, fixture } = exactDates[i];
    it(`${i}) should create suite with an ${condition} date`, async () => {
      await testSpecificDateWhichProducesFixedResult(condition, fixture);
    });
  }

});
