import moment from "moment";

// Import fixtures
import undefinedSuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-0.json";
import nullSuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-1.json";
import zeroSuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-2.json";
import emptyStringSuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-3.json";
import foobarStringSuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-4.json";
import timestamp0SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-5.json";
import timestamp1SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-6.json";
import timestamp2SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-7.json";
import timestamp3SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-8.json";
import timestamp4SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-9.json";
import timestamp5SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-10.json";
import timestamp6SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-11.json";
import timestamp7SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-12.json";
import dateString0SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-13.json";
import dateString1SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-14.json";
import dateString2SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-15.json";
import dateString3SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-16.json";
import dateString4SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-17.json";
import dateString5SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-18.json";
import dateString6SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-19.json";
import dateString7SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-20.json";
import dateString8SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-21.json";
import dateString9SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-22.json";
import dateString10SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-23.json";
import dateString11SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-24.json";
import dateString12SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-25.json";
import dateString13SuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-26.json";
import dateArraySuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-27.json";
import dateObjectSuiteFixture from "../../__fixtures__/credentials/issuanceDate/case-28.json";

import {
  issuedOn,
  createCredential,
  createSuite,
  signCredential,
  verifyProof,
  createdOn
} from "./date-utils";

console.warn = () => {};

const issuanceDates = [
  {
    condition: "",
    fixture: emptyStringSuiteFixture
  },
  {
    condition: "foobar",
    fixture: foobarStringSuiteFixture
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

const invalidDates = [
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
    condition: moment(issuedOn).toArray(),
    fixture: dateArraySuiteFixture
  }
];

// Changed to both error
const expectedErrorDates = [
  {
    condition: moment(issuedOn).toObject(),
    fixture: dateObjectSuiteFixture
  }
];

describe("issuanceDate testing", () => {
  // Both of these should be passing for Digital Bazaar and Transmute
  for (let i = 0; i < issuanceDates.length; i++) {
    const { condition, fixture } = issuanceDates[i];
    it(`should sign and verify proof with ${JSON.stringify(
      condition
    )} as issuanceDate`, async () => {
      const { suite } = await createSuite(createdOn);
      const credential = createCredential(condition);
      const { proof } = await signCredential(suite!, credential);
      credential.proof = proof;
      expect((await verifyProof(credential)).verified).toBeTruthy();
      expect((await verifyProof(fixture)).verified).toBeTruthy();
    });
  }

  // Transmute is expected to throw an error for dates that do not match vc-spec
  // Digital Bazaar is expected to create proof and verify
  for (let i = 0; i < invalidDates.length; i++) {
    const { condition, fixture } = invalidDates[i];
    it(`should throw an errror on sign with ${JSON.stringify(
      condition
    )} issuanceDate`, async () => {
      const { suite } = await createSuite(createdOn);
      const credential = createCredential(condition);
      const { proof, signError } = await signCredential(suite!, credential);
      expect(signError).toBeDefined();
      expect(proof).toBeUndefined();
      expect((await verifyProof(fixture)).verified).toBeTruthy();
    });
  }

  // This is expected to fail for both Digital Bazaar and Transmute
  for (let i = 0; i < expectedErrorDates.length; i++) {
    const { condition, fixture } = expectedErrorDates[i];
    it(`should throw an errror on sign with ${JSON.stringify(
      condition
    )} issuanceDate`, async () => {
      const { suite } = await createSuite(createdOn);
      const credential = createCredential(condition);
      const { proof, signError } = await signCredential(suite!, credential);
      expect(signError).toBeDefined();
      expect(proof).toBeUndefined();
      expect(signError?.thrownOn).toBe("sign");
      expect(fixture.type).toBe("error");
      expect(fixture.thrownOn).toBe("sign");
    });
  }
});
