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

const ISSUED_ON = new Date("1996-09-29T15:01:23.456Z").getTime();
const CREATED_ON = new Date("2021-10-15T15:01:23.456Z").getTime();

/* Abstract:
For the `issuanceDate` test, we first want to create a set of 
signed credentials with proofs with different `issuanceDates`
for a fixed time. We then want to regenerate these proofs
to make sure that we get the same jws, and ideally the exact
same proofs with the same `created` date
*/

const TESTS = [
  // Unset conditions
  "removed",
  undefined,
  null,
  0,
  "",
  // Int conditions
  1635774995208,
  -1635774995208,
  1,
  -1,
  123,
  -123,
  12345,
  -12345,
  // String conditions
  moment(ISSUED_ON).format(),
  moment(ISSUED_ON).format("dddd, MMMM Do YYYY, h:mm:ss a"),
  moment(ISSUED_ON).format("Do dddd MMMM gggg"),
  moment(ISSUED_ON).format("MMMM Qo DD YYYY"),
  moment(ISSUED_ON).format("D MMM YYYY"),
  moment(ISSUED_ON).format("YYYY-MM-DD"),
  moment(ISSUED_ON).format("ddd, DD MMM YYYY HH:mm:ss z"),
  moment(ISSUED_ON).format("MM DD YYYY"),
  moment(ISSUED_ON).format("MMM D, YYYY"),
  "1996-09-29T15:01:23",
  "1996-09-29T15:01:23.456+09:00",
  "1996-09-29T15:01:23.456Z",
  "1996-09-29T15:01:23Z",
  "1996-09-29T15:01:23-05:00",
  moment(ISSUED_ON).toArray(),
  // moment(ISSUED_ON).toObject(),
];

/*
Note: To account for the posibility of different timezones,
we should probably set a specific locale in the generate
fixtures, and then a different locale in the tests to be
able to catch any conditions where a change in unix time
results in failure to verify
*/

// initialize them all asynchronously
Promise.all(

  // First set of tests, we set various issuanceDate's for the same credential
  TESTS.map( async (date, index) => {
 
    const unsignedCredential = { ...credential };
    switch (date) {
      case "removed":
        delete unsignedCredential.issuanceDate;
        break;
      default:
        unsignedCredential.issuanceDate = date;
        break;
    }

    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);

    const suite = new Ed25519Signature2018({
      key: keyPair,
      date: new Date(CREATED_ON),
    });

    const signedCredential = await jsigs.sign(unsignedCredential, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader,
    });

    const filename = path.resolve( __dirname, `../src/__fixtures__/credentials/issuanceDate/case-${index}.json`);
    const fileContent = JSON.stringify(signedCredential, null, 2);
    fs.writeFileSync(filename, fileContent);

  }),

  // For the second set of tests, we have a fixed credential and we change what we pass what date we have into the suite constructor
  TESTS.map( async (date, index) => {
 
    const unsignedCredential = { ...credential };
    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    const filename = path.resolve( __dirname, `../src/__fixtures__/credentials/suiteConstructor/case-${index}.json`);

    let suite, signedCredential;
    try {
      suite = new Ed25519Signature2018({
        key: keyPair,
        date: date,
      });
    } catch(err) {
      const fileContent = JSON.stringify({
        type: 'error',
        thrownOn : 'suite',
        reason : err.toString()
      }, null, 2);
      return fs.writeFileSync(filename, fileContent);
    }

    if (typeof suite.date === "undefined") {
      suite.date = new Date(CREATED_ON);
    }
    
    try {
      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader,
      });
    } catch(err) {
      const fileContent = JSON.stringify({
        type: 'error',
        thrownOn : 'sign',
        reason : err.toString()
      }, null, 2);
      return fs.writeFileSync(filename, fileContent);
    }

    const fileContent = JSON.stringify(signedCredential, null, 2);
    fs.writeFileSync(filename, fileContent);

  }),

  // For the third set of tests, we have a fixed credential and we change what we pass what date directly into the suite after creation
  TESTS.map( async (date, index) => {
 
    const unsignedCredential = { ...credential };
    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    const filename = path.resolve( __dirname, `../src/__fixtures__/credentials/suiteDirect/case-${index}.json`);

    console.log(index, date);

    const suite = new Ed25519Signature2018({
      key: keyPair
    });
    suite.date = date;

    let signedCredential;
    try {
      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader,
      });
    } catch(err) {
      const fileContent = JSON.stringify({
        type: 'error',
        thrownOn : 'sign',
        reason : err.toString()
      }, null, 2);
      return fs.writeFileSync(filename, fileContent);
    }
    
    const fileContent = JSON.stringify(signedCredential, null, 2);
    fs.writeFileSync(filename, fileContent);

  }),

  // For the fourth set of 
  TESTS.map( async (date, index) => {
 
    const unsignedCredential = { ...credential };
    switch (date) {
      case "removed":
        delete unsignedCredential.issuanceDate;
        break;
      default:
        unsignedCredential.issuanceDate = date;
        break;
    }

    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    const filename = path.resolve( __dirname, `../src/__fixtures__/credentials/issuanceDateSuite/case-${index}.json`);

    let suite, signedCredential;
    try {
      suite = new Ed25519Signature2018({
        key: keyPair,
        date: date,
      });
    } catch(err) {
      const fileContent = JSON.stringify({
        type: 'error',
        thrownOn : 'suite',
        reason : err.toString()
      }, null, 2);
      return fs.writeFileSync(filename, fileContent);
    }

    if (typeof suite.date === "undefined") {
      suite.date = new Date(CREATED_ON);
    }
    
    try {
      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader,
      });
    } catch(err) {
      const fileContent = JSON.stringify({
        type: 'error',
        thrownOn : 'sign',
        reason : err.toString()
      }, null, 2);
      return fs.writeFileSync(filename, fileContent);
    }

    const fileContent = JSON.stringify(signedCredential, null, 2);
    fs.writeFileSync(filename, fileContent);

  }),

).then(function() {
  console.log("Wrote the fixtures!!!");
});
