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
const documentLoader = require("../documentLoader");
const rawKeyJson = require("../../src/__fixtures__/keys/key.json");

const ISSUED_ON = new Date("1991-08-25T12:33:56.789Z").getTime();
const CREATED_ON = new Date("2021-10-15T12:33:56.789Z").getTime();

const issueConditions = [
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

const createdConditions = [
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
  moment(CREATED_ON).format(),
  moment(CREATED_ON).format("dddd, MMMM Do YYYY, h:mm:ss a"),
  moment(CREATED_ON).format("Do dddd MMMM gggg"),
  moment(CREATED_ON).format("dddd MMMM DD, YYYY"),
  moment(CREATED_ON).format("D MMM YYYY"),
  moment(CREATED_ON).format("YYYY-MM-DD"),
  moment(CREATED_ON).format("ddd, DD MMM YYYY HH:mm:ss z"),
  moment(CREATED_ON).format("MM DD YYYY"),
  moment(CREATED_ON).format("MMM D, YYYY"),
  moment(CREATED_ON).format("YYYY-MM-DD[T]HH:mm:ss"),
  moment(CREATED_ON).format("YYYY-MM-DD[T]HH:mm:ss:SSSZ"),
  moment(CREATED_ON).format("YYYY-MM-DD[T]HH:mm:ss[Z]"),
  moment(CREATED_ON).format("YYYY-MM-DD[T]HH:mmZ"),
  moment(CREATED_ON).toJSON(),
  moment(CREATED_ON).toArray(),
  moment(CREATED_ON).toObject(),
];



const exampleCredential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  id: "http://example.edu/credentials/1872",
  type: ["VerifiableCredential", "AlumniCredential"],
  issuer: "https://example.edu/issuers/565049",
  credentialSubject: {
    id: "https://example.edu/students/alice",
    alumniOf: "Example University",
  },
};

const cloneCredential = (credential) => {
  return JSON.parse(JSON.stringify(credential));
};

const createCredential = (issuanceDate) => {
  const credential = cloneCredential(exampleCredential);
  credential.issuanceDate = issuanceDate;
  return credential;
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
  }

  return { signedCredential, signedError };
};

const writeResult = (folderName, index, result) => {
  const filename = path.resolve(
    __dirname,
    `../../src/__fixtures__/credentials/${folderName}/case-${index}.json`
  );
  fs.writeFileSync(filename, JSON.stringify(result, null, 2));
};

module.exports = {
  ISSUED_ON,
  CREATED_ON,
  issueConditions,
  createdConditions,
  exampleCredential,
  cloneCredential,
  createCredential,
  createSuite,
  signCredential,
  writeResult
}