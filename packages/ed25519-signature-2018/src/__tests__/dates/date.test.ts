import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "../..";
import moment from "moment";
import fs from "fs";
import path from "path";
import rawKeyJson from "../../__fixtures__/keys/key.json";
import documentLoader from "../../__fixtures__/documentLoader";

import { exampleCredential as credential, verifyProof } from "./date-utils";
export const ISSUED_ON = new Date("1991-08-25T12:33:56.789Z").getTime();
export const CREATED_ON = new Date("2021-10-15T12:33:56.789Z").getTime();

const TESTS = [
  // Used as a flag to unset `issuanceDate` in the document for the 1st and 4th tests
  // This behavior doesn't carry over to tests 2 and 3 and is treated as a duplicate null test
  "removed",
  undefined,
  null,
  0,
  "",
  "foobar",
  // Int conditions
  1635774995208,
  -1635774995208,
  1,
  -1,
  123,
  -123,
  12345,
  -12345,
  // Date String conditions
  moment(ISSUED_ON).format(),
  moment(ISSUED_ON).format("dddd, MMMM Do YYYY, h:mm:ss a"),
  moment(ISSUED_ON).format("Do dddd MMMM gggg"),
  moment(ISSUED_ON).format("dddd MMMM DD, YYYY"),
  moment(ISSUED_ON).format("D MMM YYYY"),
  moment(ISSUED_ON).format("YYYY-MM-DD"),
  moment(ISSUED_ON).format("ddd, DD MMM YYYY HH:mm:ss z"),
  moment(ISSUED_ON).format("MM DD YYYY"),
  moment(ISSUED_ON).format("MMM D, YYYY"),
  moment(ISSUED_ON).format("YYYY-MM-DD[T]HH:mm:ss"),
  moment(ISSUED_ON).format("YYYY-MM-DD[T]HH:mm:ss:SSSZ"),
  moment(ISSUED_ON).format("YYYY-MM-DD[T]HH:mm:ss[Z]"),
  moment(ISSUED_ON).format("YYYY-MM-DD[T]HH:mmZ"),
  moment(ISSUED_ON).toJSON(),
  moment(ISSUED_ON).toArray(),
  moment(ISSUED_ON).toObject()
];

const createSuite = async (suiteDate?: any) => {
  const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);

  let suite, suiteError;
  try {
    suite = new Ed25519Signature2018({
      key: keyPair,
      date: suiteDate
    });
  } catch (err) {
    const error = err as Error;
    suiteError = {
      type: "error",
      thrownOn: "suite",
      reason: error.toString()
    };
    return { suite, suiteError };
  }

  if (typeof suite.date === "undefined") {
    suite.date = new Date(CREATED_ON);
  }

  return { suite, suiteError };
};

const signCredential = async (
  suite: Ed25519Signature2018,
  unsignedCredential: any
) => {
  let signedError;
  const signedCredential = { ...unsignedCredential };

  try {
    signedCredential.proof = await suite.createProof({
      document: unsignedCredential,
      purpose: {
        // ignore validation of dates and such...
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
  } catch (err) {
    let error = err as Error;
    signedError = {
      type: "error",
      thrownOn: "sign",
      reason: error.toString()
    };
    return { signedCredential, signedError };
  }

  return { signedCredential, signedError };
};

const getFixture = (testNum: number, index: number) => {
  const dirs = [
    "issuanceDate",
    "suiteConstructor",
    "suiteDirect",
    "issuanceDateSuite"
  ];

  const filename = path.resolve(
    __dirname,
    `../../__fixtures__/credentials/${dirs[testNum - 1]}/case-${index}.json`
  );

  const data = fs.readFileSync(filename, "utf-8");
  return JSON.parse(data);
};

// The fixture has an error but we dont
const isErrorInFixtureExpected = (output: any, fixture: any) => {
  return fixture.type === "error" && output.type !== "error";
};

// We have an error, but the fixture doesn't
const hasOurLibraryDriftedFromTheFixture = (output: any, fixture: any) => {
  return fixture.type !== "error" && output.type === "error";
};

// We have an error, and the fixture has an error
const doWeErrorWhenDigitalBazaarErrors = (output: any, fixture: any) => {
  return fixture.type === "error" && output.type === "error";
};

const isOutputAndFixtureMatchingExpectations = (output: any, fixture: any) => {
  const clonedOutput = JSON.parse(JSON.stringify(output));
  const clonedFixture = JSON.parse(JSON.stringify(fixture));

  delete clonedOutput.proof;
  delete clonedOutput.issuanceDate;

  delete clonedFixture.proof;
  delete clonedFixture.issuanceDate;

  // We make sure the input documents are the same
  expect(clonedOutput).toEqual(clonedFixture);

  // We expect these to thrash, not going to check

  // Then we want to make that the created dates and hashes work
  // expect(outputProof.created).toEqual(fixtureProof.created);
  // expect(outputProof.jws).toEqual(fixtureProof.jws);
};

const compareResults = async (output: any, fixture: any) => {
  // Option 1, The fixture has an error and we don't
  if (isErrorInFixtureExpected(output, fixture)) {
    throw new Error(
      "We expected an error given the fixture, but our code did not produce one"
    );
  }

  // Option 2, we have an error, the fixture doesn't
  if (hasOurLibraryDriftedFromTheFixture(output, fixture)) {
    throw new Error("Our code is producing an error that we didn't expect");
  }

  // Option 3. We both have errors, are they the same error?
  if (doWeErrorWhenDigitalBazaarErrors(output, fixture)) {
    // we dont want to continue,
    // expected errors, "good" result
    return;
  }

  isOutputAndFixtureMatchingExpectations(output, fixture);

  let { proof, ...credential } = fixture;

  // We also expect that the signed credentials are verifiable
  const result1 = await verifyProof(credential, proof);
  expect(result1.verified).toBeTruthy();

  ({ proof, ...credential } = output);

  const result2 = await verifyProof(credential, proof);
  expect(result2.verified).toBeTruthy();
};

describe("Test 1. Confirm behavior of issuanceDate", () => {
  const testNum = 1;

  // Skipping toObject test as JSON-LD error pending further investigation
  // https://github.com/transmute-industries/verifiable-data/issues/124
  for (let i = 0; i < TESTS.length - 1; i++) {
    const date = TESTS[i];

    it(`1. case-${i} ${JSON.stringify(
      date
    )} should match the verifiable credential`, async () => {
      const fixture = getFixture(testNum, i);
      const { suite, suiteError } = await createSuite(CREATED_ON);
      if (suiteError) {
        return compareResults(suiteError, fixture);
      }

      const unsignedCredential = { ...credential };

      switch (date) {
        case "removed":
          // @ts-ignore
          delete unsignedCredential.issuanceDate;
          break;
        default:
          // @ts-ignore
          unsignedCredential.issuanceDate = date;
          break;
      }

      const { signedCredential, signedError } = await signCredential(
        suite!,
        unsignedCredential
      );

      if (signedError) {
        return compareResults(signedError, fixture);
      }

      await compareResults(signedCredential, fixture);
    });
  }
});

/*
describe("Test 2. Confirm behavior of suite date constructor", () => {
  const testNum = 2;
  for (let i = 0; i < TESTS.length; i++) {
    const date = TESTS[i];

    it(`2. case-${i}  ${JSON.stringify(
      date
    )} should match the verifiable credential`, async () => {
      const fixture = getFixture(testNum, i);

      let dateParam = date;
      if (date === "removed") {
        dateParam = null;
      }

      const { suite, suiteError } = await createSuite(dateParam);
      if (suiteError) {
        return compareResults(suiteError, fixture);
      }

      const unsignedCredential = { ...credential };
      const { signedCredential, signedError } = await signCredential(
        suite!,
        unsignedCredential
      );

      if (signedError) {
        return compareResults(signedError, fixture);
      }

      await compareResults(signedCredential, fixture);
    });
  }
});
*/
/*
describe("Test 3. Confirm behavior of suite date set directly", () => {
  const testNum = 3;
  for (let i = 0; i < TESTS.length; i++) {
    const date = TESTS[i];
    it(`3. case-${i} ${JSON.stringify(
      date
    )} should match the verifiable credential`, async () => {
      const fixture = getFixture(testNum, i);
      const { suite, suiteError } = await createSuite();
      if (suiteError) {
        return compareResults(suiteError, fixture);
      }

      switch (date) {
        case "removed":
          // Per test we duplicate the null test
          suite!.date = null;
          break;
        case undefined:
          // This will generate a new date
          break;
        default:
          suite!.date = date;
          break;
      }

      const unsignedCredential = { ...credential };
      const { signedCredential, signedError } = await signCredential(
        suite!,
        unsignedCredential
      );

      if (signedError) {
        return compareResults(signedError, fixture);
      }
      await compareResults(signedCredential, fixture);
    });
  }
});
*/
/*
describe("Test 4. Confirm behavior of issuanceDate", () => {
  const testNum = 4;
  for (let i = 0; i < TESTS.length; i++) {
    const date = TESTS[i];
    it(`4. case-${i}  ${JSON.stringify(
      date
    )} should match the verifiable credential`, async () => {
      const fixture = getFixture(testNum, i);

      const unsignedCredential = { ...credential };
      switch (date) {
        case "removed":
          // @ts-ignore
          delete unsignedCredential.issuanceDate;
          break;
        default:
          // @ts-ignore
          unsignedCredential.issuanceDate = date;
          break;
      }

      const { suite, suiteError } = await createSuite(
        unsignedCredential.issuanceDate
      );

      if (suiteError) {
        return compareResults(suiteError, fixture);
      }

      const { signedCredential, signedError } = await signCredential(
        suite!,
        unsignedCredential
      );
      if (signedError) {
        return compareResults(signedError, fixture);
      }

      await compareResults(signedCredential, fixture);
    });
  }
});
*/
