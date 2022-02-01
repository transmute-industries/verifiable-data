import moment from "moment";

// Import fixtures
import undefinedSuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-1.json";
import nullSuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-2.json";
import zeroSuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-3.json";
import emptyStringSuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-4.json";
import foobarStringSuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-5.json";
import timestamp0SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-6.json";
import timestamp1SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-7.json";
import timestamp2SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-8.json";
import timestamp3SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-9.json";
import timestamp4SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-10.json";
import timestamp5SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-11.json";
import timestamp6SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-12.json";
import timestamp7SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-13.json";
import dateString0SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-14.json";
import dateString1SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-15.json";
import dateString2SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-16.json";
import dateString3SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-17.json";
import dateString4SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-18.json";
import dateString5SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-19.json";
import dateString6SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-20.json";
import dateString7SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-21.json";
import dateString8SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-22.json";
import dateString9SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-23.json";
import dateString10SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-24.json";
import dateString11SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-25.json";
import dateString12SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-26.json";
import dateString13SuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-27.json";
import dateArraySuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-28.json";
import dateObjectSuiteFixture from "../../__fixtures__/credentials/suiteDirect/case-29.json";

import {
  issuedOn,
  createCredential,
  createSuite,
  signCredential,
  verifyProof
} from "./date-utils";

console.warn = () => {};

const directDates = [
  {
    condition: undefined,
    fixture: undefinedSuiteFixture
  },
  {
    condition: "foobar",
    fixture: foobarStringSuiteFixture
  },
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
    condition: moment(issuedOn).format(),
    fixture: dateString0SuiteFixture
  },
  {
    condition: moment(issuedOn).format("dddd, MMMM Do YYYY, h:mm:ss a"),
    fixture: dateString1SuiteFixture
  },
  {
    condition: moment(issuedOn).format("Do dddd MMMM gggg"),
    fixture: dateString2SuiteFixture
  },
  {
    condition: moment(issuedOn).format("dddd MMMM DD, YYYY"),
    fixture: dateString3SuiteFixture
  },
  {
    condition: moment(issuedOn).format("D MMM YYYY"),
    fixture: dateString4SuiteFixture
  },
  {
    condition: moment(issuedOn).format("YYYY-MM-DD"),
    fixture: dateString5SuiteFixture
  },
  {
    condition: moment(issuedOn).format("ddd, DD MMM YYYY HH:mm:ss z"),
    fixture: dateString6SuiteFixture
  },
  {
    condition: moment(issuedOn).format("MM DD YYYY"),
    fixture: dateString7SuiteFixture
  },
  {
    condition: moment(issuedOn).format("MMM D, YYYY"),
    fixture: dateString8SuiteFixture
  },
  {
    condition: moment(issuedOn).format("YYYY-MM-DD[T]HH:mm:ss"),
    fixture: dateString9SuiteFixture
  },
  {
    condition: moment(issuedOn).format("YYYY-MM-DD[T]HH:mm:ss:SSSZ"),
    fixture: dateString10SuiteFixture
  },
  {
    condition: moment(issuedOn).format("YYYY-MM-DD[T]HH:mm:ss[Z]"),
    fixture: dateString11SuiteFixture
  },
  {
    condition: moment(issuedOn).format("YYYY-MM-DD[T]HH:mmZ"),
    fixture: dateString12SuiteFixture
  },
  {
    condition: moment(issuedOn).toJSON(),
    fixture: dateString13SuiteFixture
  }
];

const producesNoCreatedOnValue = [
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

const expectedToFail = [
  {
    condition: moment(issuedOn).toArray(),
    fixture: dateArraySuiteFixture
  },
  {
    condition: moment(issuedOn).toObject(),
    fixture: dateObjectSuiteFixture
  }
];

describe("passing date to suite after constructor", () => {
  for (let i = 0; i < directDates.length; i++) {
    const { condition, fixture } = directDates[i];
    it(`should create and sign for ${JSON.stringify(
      condition
    )} set in suite`, async () => {
      // Create a suite using undefined
      const { suite } = await createSuite(undefined);
      // Set the date of the suite after the constructor
      suite!.date = condition;

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

      // We expect the proofs to verify for both our credential and for the digital bazaar fixture
      expect((await verifyProof(credential)).verified).toBeTruthy();
      expect((await verifyProof(fixture)).verified).toBeTruthy();
    });
  }

  for (let i = 0; i < producesNoCreatedOnValue.length; i++) {
    const { condition, fixture } = producesNoCreatedOnValue[i];
    it(`should have no createdOn for ${JSON.stringify(
      condition
    )} set in suite`, async () => {
      // Create a suite using undefined
      const { suite } = await createSuite(undefined);
      // Set the date of the suite after the constructor
      suite!.date = condition;

      // Create a valid credential to be signed
      const credential = createCredential(issuedOn);

      // Sign the valid credential with undefined date suite
      const { proof, signError } = await signCredential(suite!, credential);
      expect(proof).toBeDefined();
      credential.proof = proof;

      // Specifically the created attribute should be the current time
      expect(proof!.created).toBeUndefined();
      expect(signError).toBeUndefined();

      // Compare against fixture result, we expect a proof
      expect(fixture.proof).toBeDefined();

      // We expect the proofs to verify for both our credential and for the digital bazaar fixture
      expect((await verifyProof(credential)).verified).toBeTruthy();
      expect((await verifyProof(fixture)).verified).toBeTruthy();
    });
  }

  for (let i = 0; i < expectedToFail.length; i++) {
    const { condition, fixture } = expectedToFail[i];
    it(`should throw error on sign for ${JSON.stringify(
      condition
    )} set in suite`, async () => {
      // Create a suite using undefined
      const { suite } = await createSuite(undefined);
      // Set the date of the suite after the constructor
      suite!.date = condition;

      // Create a valid credential to be signed
      const credential = createCredential(issuedOn);

      // Sign the valid credential with undefined date suite
      const { proof, signError } = await signCredential(suite!, credential);
      expect(proof).toBeUndefined();
      expect(signError).toBeDefined();
      expect(fixture.type).toBe("error");
      expect(fixture.thrownOn).toBe("sign");
    });
  }
});
