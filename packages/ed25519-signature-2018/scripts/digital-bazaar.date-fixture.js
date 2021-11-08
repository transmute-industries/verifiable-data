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
const credential = require("../src/__fixtures__/credentials/case-7.json");
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

/*
  Global Variables:
  ISSUED_ON - Is a fixed date that we use to generate different
  versions of date strings for the same date to pass into each
  test. The date such as Aug 25, 1991 was chosen to show a contrast 
  for the issued date, so that it would readily appearant when the
  date was being used. 

  The value of '12:33:56.789Z' has been added to the hours, minutes,
  seconds and milliseconds to be able to account for changes when
  milliseconds are truncated in XML datetime conversions. 

  CREATED_ON - This is a date used to mimic the current time. 
  In the case when a date value is not supplied into the suite,
  a new timestamp is generated with a current time, which means
  the jws will have a different hash when we write tests to verify
  the results. oct 15, 2021 has been chosen to represent a resent
  date, but no so recent that it would be mistaken for the current date.

  The value of '12:33:56.789Z' has been added to the hours, minutes,
  seconds and milliseconds to be able to account for changes when
  milliseconds are truncated in XML datetime conversions. 

  TESTS - This is a list of values that will be used in the following
  tests. The values have been chosen to try and cover a wide array of
  conditions and possible failure points. And invalid values have
  been intentionally been included to track where and how invalid values
  are handled. 
*/

const ISSUED_ON = new Date("1991-08-25T12:33:56.789Z").getTime();
const CREATED_ON = new Date("2021-10-15T12:33:56.789Z").getTime();

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
  moment(ISSUED_ON).toObject(),
];

const writeResult = (filename, result) => {
  fs.writeFileSync(filename, JSON.stringify(result, null, 2));
};

const getFilenameForTest = (testNum, index) => {
  const dirs = [
    "issuanceDate",
    "suiteConstructor",
    "suiteDirect",
    "issuanceDateSuite",
  ];

  return path.resolve(
    __dirname,
    `../src/__fixtures__/credentials/${dirs[testNum - 1]}/case-${index}.json`
  );
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
    switch(date){
      case 'removed':
        // Duplicated 'removed' keyword for null test
        suite.date = null;
        break;
      case undefined:
        // This will generate a new date
        break;
      default:
        suite.date = date
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
  }),

  /*
  Test 4 - One use-case is to set the `created` date of the suite
  to the `issuanceDate` of the document being passed in. This is
  effectively a repeat of tests 1 and 2. But we have included it 
  to account for any issues that might arrise from this depending
  on the value.  
  */

  TESTS.map(async (date, index) => {
    // Create Credential to be Signed
    // Per test, set issuanceData to test variable
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
    const testNum = 4;
    const filename = getFilenameForTest(testNum, index);

    // Create Suite to sign Credential
    // Per test, pass in issuanceDate into constructor
    const { suite, suiteError } = await createSuite(
      unsignedCredential.issuanceDate
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
  })
);
