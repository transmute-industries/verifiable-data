/*
  Imports
*/

const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");
const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");

const fs = require("fs");
const path = require("path");

const jsigs = require("jsonld-signatures");
const { AssertionProofPurpose } = jsigs.purposes;
const moment = require("moment");
const documentLoader = require("./documentLoader");
const credential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  id: "http://example.edu/credentials/1872",
  type: ["VerifiableCredential", "AlumniCredential"],
  issuer: "https://example.edu/issuers/565049",
  issuanceDate: "2010-01-01T19:23:24Z",
  credentialSubject: {
    id: "https://example.edu/students/alice",
    alumniOf: "Example University",
  },
};
const rawKeyJson = require("../src/__fixtures__/keys/key.json");

/* 
  Abstract:
  We are using this script to generate fixtures for a series of tests. 
  Each one of the tests will use the same inputs to test how dates are
  treated with respect to credentials and proofs in two locations.

  First we have the `issuanceDate` property in the credential, and
  then we have the `created` term on the resulting proof. The purpose
  of these tests is to test posible values as applied to each one of
  these locations, and isolate reasons why they might fail, cause a
  change in the way the `jws` is created on the proof, or otherwise
  cause a proof to not be verifable. 
*/

const ISSUED_ON = new Date("1991-08-25T12:33:56.789Z").getTime();
const CREATED_ON = new Date("2021-10-15T12:33:56.789Z").getTime();

const IssuedOn = [
  undefined,
  null,
  0,
  "",
  "foobar",
  1635774995208,
  -1635774995208,
  1,
  -1,
  123,
  -123,
  12345,
  -12345,
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
  moment(ISSUED_ON).toObject(),
];

const CreatedOn = [
  undefined,
  null,
  0,
  "",
  "foobar",
  1635774995208,
  -1635774995208,
  1,
  -1,
  123,
  -123,
  12345,
  -12345,
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
  moment(ISSUED_ON).toObject(),
];

const writeResult = (testNum, index, result) => {
  const dirs = ["issuanceDate", "suiteConstructor", "suiteDirect"];
  const filename = path.resolve(
    __dirname,
    `../src/__fixtures__/credentials/${dirs[testNum - 1]}/case-${index}.json`
  );
  fs.writeFileSync(filename, JSON.stringify(result, null, 2));
};

const createSuite = async (suiteDate) => {
  const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);

  let suite, suiteError;
  try {
    suite = new Ed25519Signature2018({
      key: keyPair,
      date: suiteDate,
    });
  } catch (err) {
    suiteError = {
      type: "error",
      thrownOn: "suite",
      reason: err.toString(),
    };
    return { suite, suiteError };
  }

  if (typeof suite.date === "undefined") {
    suite.date = new Date(CREATED_ON);
  }

  return { suite, suiteError };
};

const signCredential = async (suite, unsignedCredential) => {
  let signedCredential, signedError;

  try {
    signedCredential = await jsigs.sign(unsignedCredential, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader,
    });
  } catch (err) {
    signedError = {
      type: "error",
      thrownOn: "sign",
      reason: err.toString(),
    };
    return { signedCredential, signedError };
  }

  return { signedCredential, signedError };
};

Promise.all(
  /*
  Test 1 - We pass a date into the `issuanceDate` term in the credential
  before signing the proof. This is the baseline test. As the `issuanceDate`
  should be treated as part of the document being signed, in all tests
  this value should have no change. 
  */

  TESTS.map(async (date, index) => {
    // Create Credential to be Signed
    // per test, use value of date as issuanceDate
    // On 'removed' keyword, unset issuanceDate term from unsigned credential
    const unsignedCredential = { ...credential };
    switch (date) {
      case "removed":
        // Use removed as keyword to unset issuanceDate
        delete unsignedCredential.issuanceDate;
        break;
      default:
        unsignedCredential.issuanceDate = date;
        break;
    }

    // Get filepath for writing output
    const testNum = 1;
    const filename = getFilenameForTest(testNum, index);

    // Create Suite to sign Credential
    const { suite, suiteError } = await createSuite(CREATED_ON);

    // Check for Suite Errors
    if (suiteError) {
      return writeResult(filename, suiteError);
    }

    // Sign the Credential
    const { signedCredential, signedError } = await signCredential(
      suite,
      unsignedCredential
    );

    // Check for sign Errors
    if (signedError) {
      return writeResult(filename, signedError);
    }

    // Write Test Output
    return writeResult(filename, signedCredential);
  }),

  /*
  Test 2 - We pass a date into the constructor of the suite. The suite
  will parse this value as a Date and then convert the value into an
  XML string, so we want to compare what the output string is for
  a given input.
  */

  TESTS.map(async (date, index) => {
    // Create Credential to be Signed
    const unsignedCredential = { ...credential };

    // Get filepath for writing output
    const testNum = 2;
    const filename = getFilenameForTest(testNum, index);

    // Create Suite to sign Credential
    // Per test, pass date value into constructor
    // Duplicate use of 'removed' keyword for null test
    const { suite, suiteError } = await createSuite(
      date === "removed" ? null : date
    );

    // Check for Suite Errors
    if (suiteError) {
      return writeResult(filename, suiteError);
    }

    // Sign the Credential
    const { signedCredential, signedError } = await signCredential(
      suite,
      unsignedCredential
    );

    // Check for sign Errors
    if (signedError) {
      return writeResult(filename, signedError);
    }

    // Write Test Output
    return writeResult(filename, signedCredential);
  }),

  /*
  Test 3 - While testing we found that the value for the suite's
  date can be created after construction of the object. This will
  change what values are written to the `created` date on the proof.
  These values need to be tracked and accounted for. 
  */

  TESTS.map(async (date, index) => {
    // Create Credential to be Signed
    const unsignedCredential = { ...credential };

    // Get filepath for writing output
    const testNum = 3;
    const filename = getFilenameForTest(testNum, index);

    // Create Suite to sign Credential
    const { suite, suiteError } = await createSuite();

    // Per test, set value of date after constructor
    switch (date) {
      case "removed":
        // Duplicated 'removed' keyword for null test
        suite.date = null;
        break;
      case undefined:
        // This will generate a new date
        break;
      default:
        suite.date = date;
        break;
    }

    // Check for Suite Errors
    if (suiteError) {
      return writeResult(filename, suiteError);
    }

    // Sign the Credential
    const { signedCredential, signedError } = await signCredential(
      suite,
      unsignedCredential
    );

    // Check for sign Errors
    if (signedError) {
      return writeResult(filename, signedError);
    }

    // Write Test Output
    return writeResult(filename, signedCredential);
  })
);
