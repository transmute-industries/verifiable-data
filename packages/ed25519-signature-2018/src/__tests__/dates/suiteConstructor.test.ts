/**
 * In this test we want to confirm how different date values are
 * handled by the suite constructor. And what effect is has on the
 * created attribute in the generated proof.
 *
 * In this test we will confirm the operation of Transmute's
 * libraries using fixtures generated from Digital Bazaar's library
 **/

// Import Libraries
import moment from "moment";

// Import fixtures
import undefinedSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-0.json";
import nullSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-1.json";
import zeroSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-2.json";
import emptyStringSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-3.json";
import foobarStringSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-4.json";
import timestamp0SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-5.json";
import timestamp1SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-6.json";
import timestamp2SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-7.json";
import timestamp3SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-8.json";
import timestamp4SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-9.json";
import timestamp5SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-10.json";
import timestamp6SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-11.json";
import timestamp7SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-12.json";
import dateString0SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-13.json";
import dateString1SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-14.json";
import dateString2SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-15.json";
import dateString3SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-16.json";
import dateString4SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-17.json";
import dateString5SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-18.json";
import dateString6SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-19.json";
import dateString7SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-20.json";
import dateString8SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-21.json";
import dateString9SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-22.json";
import dateString10SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-23.json";
import dateString11SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-24.json";
import dateString12SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-25.json";
import dateString13SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-26.json";
import dateArraySuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-27.json";
import dateObjectSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-28.json";

// Import local functions
import {
  issuedOn,
  createdOn,
  createCredential,
  createSuite,
  signCredential,
  isDateValidXmlSchema,
  verifyProof
} from "./date-utils";

console.warn = () => {};
const issuanceDate = moment(issuedOn).toJSON();

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
    condition: "",
    fixture: emptyStringSuiteFixture
  }
];

const invalidDates = [
  {
    condition: "foobar",
    fixture: foobarStringSuiteFixture
  },
  {
    condition: moment(createdOn).format("dddd, MMMM Do YYYY, h:mm:ss a"),
    fixture: dateString1SuiteFixture
  },
  {
    condition: moment(createdOn).format("Do dddd MMMM gggg"),
    fixture: dateString2SuiteFixture
  },
  {
    condition: moment(createdOn).toObject(),
    fixture: dateObjectSuiteFixture
  },
  {
    condition: moment(createdOn).toArray(),
    fixture: dateArraySuiteFixture
  },
  {
    condition: moment(createdOn).format("YYYY-MM-DD[T]HH:mm:ss:SSSZ"),
    fixture: dateString10SuiteFixture // ...
  }
];

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
    condition: moment(createdOn).format(),
    fixture: dateString0SuiteFixture // ...
  },

  {
    condition: moment(createdOn).format("D MMM YYYY"),
    fixture: dateString4SuiteFixture
  },
  {
    condition: moment(createdOn).format("YYYY-MM-DD"),
    fixture: dateString5SuiteFixture
  },
  {
    condition: moment(createdOn).format("ddd, DD MMM YYYY HH:mm:ss z"),
    fixture: dateString6SuiteFixture
  },
  {
    condition: moment(createdOn).format("MM DD YYYY"),
    fixture: dateString7SuiteFixture
  },
  {
    condition: moment(createdOn).format("MMM D, YYYY"),
    fixture: dateString8SuiteFixture
  },
  {
    condition: moment(createdOn).format("YYYY-MM-DD[T]HH:mm:ss"),
    fixture: dateString9SuiteFixture
  },
  {
    condition: moment(createdOn).format("YYYY-MM-DD[T]HH:mmZ"),
    fixture: dateString12SuiteFixture
  },
  {
    condition: moment(createdOn).toJSON(),
    fixture: dateString13SuiteFixture
  },
  {
    condition: moment(createdOn).format("dddd MMMM DD, YYYY"),
    fixture: dateString3SuiteFixture
  },
  {
    condition: moment(createdOn).format("YYYY-MM-DD[T]HH:mm:ss[Z]"),
    fixture: dateString11SuiteFixture
  }
];

const testUndefinedDatesThatCauseNewIssueDate = async (
  condition: Condition,
  fixture: CredentialType
) => {
  // Create a suite using undefined for the date parameter that gets passed into the suite
  const { suite, suiteError } = await createSuite(condition);

  // There will be no error, the date attribute on suite will be undefined
  expect(suite).toBeDefined();
  expect(suite!.date).toBeUndefined();
  expect(suiteError).toBeUndefined();

  // Create a valid credential to be signed
  const credential = createCredential(issuanceDate);

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
  expect(isDateValidXmlSchema(fixture.proof!.created)).toBeTruthy();

  // We expect the proofs to verify for both our credential and for the digital bazaar fixture
  expect((await verifyProof(credential)).verified).toBeTruthy();
  expect((await verifyProof(fixture)).verified).toBeTruthy();
};

const testInvalidDatesThatCauseErrorOnSuite = async (
  condition: Condition,
  fixture: DateErrorType
) => {
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
};

const testSpecificDateWhichProducesFixedResult = async (
  condition: Condition,
  fixture: CredentialType
) => {
  const { suite, suiteError } = await createSuite(condition);
  expect(suite).toBeDefined();
  expect(suite!.date).toBeDefined();
  expect(suiteError).toBeUndefined();

  // Create a valid credential to be signed
  const credential = createCredential(issuanceDate);

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
  // expect(fixture.proof!.created).toBe(proof!.created);

  // Both Transmute and Digital Bazaar should have valid dates
  expect(isDateValidXmlSchema(proof!.created)).toBeTruthy();
  expect(isDateValidXmlSchema(fixture.proof!.created)).toBeTruthy();

  // We expect the proofs to verify for both our credential and for the fixture
  expect((await verifyProof(credential)).verified).toBeTruthy();
  expect((await verifyProof(fixture)).verified).toBeTruthy();
};

describe("Handling undefined date value provided into suite", () => {
  // Pattern 1, undefined date provided into suite
  for (let i = 0; i < undefinedDates.length; i++) {
    const { condition, fixture } = undefinedDates[i];
    it(`${i}) should create suite with an ${condition} date`, async () => {
      await testUndefinedDatesThatCauseNewIssueDate(condition, fixture);
    });
  }
});

describe("Handling specific date value provided into suite", () => {
  // Pattern 2, produces a proof with a specific created value
  for (let i = 0; i < exactDates.length; i++) {
    const { condition, fixture } = exactDates[i];
    it(`${i}) should create suite with an ${condition} date`, async () => {
      await testSpecificDateWhichProducesFixedResult(condition, fixture);
    });
  }
});

describe("Handling errors for invalid provided into suite", () => {
  // Pattern 3, invalid date value causes error to be thrown
  for (let i = 0; i < invalidDates.length; i++) {
    const { condition, fixture } = invalidDates[i];
    it(`${i}) should create suite with an ${condition} date`, async () => {
      await testInvalidDatesThatCauseErrorOnSuite(condition, fixture);
    });
  }
});
