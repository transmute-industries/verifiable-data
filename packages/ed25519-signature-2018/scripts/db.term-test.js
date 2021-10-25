const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");
const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");
const rawKeyJson = require("../src/__fixtures__/key.json");
const documentLoader = require("./documentLoader");

let keyPair;
let suite;
let proof;

const purpose = {
  // ignore validation of dates and such...
  validate: () => {
    return { valid: true };
  },
  update: (proof) => {
    proof.proofPurpose = "assertionMethod";
    return proof;
  },
};

const expect = (value) => {
  return {
    toBeDefined: () => {
      const condition = value !== undefined;
      if (!condition) {
        throw new Error(
          `expected value to be defined... but it was undefined.`
        );
      }
    },
    toBeUndefined: () => {
      const condition = value === undefined;
      if (!condition) {
        throw new Error(`expected value to be undefined... but it was not.`);
      }
    },
    toEqual: (value2) => {
      const condition = JSON.stringify(value) === JSON.stringify(value2);
      if (!condition) {
        throw new Error(`expected value to be equal... but they were not.`);
      }
    },
    not: {
      toEqual: (value2) => {
        const condition = JSON.stringify(value) !== JSON.stringify(value2);
        if (!condition) {
          throw new Error(`expected value to not be equal... but they were.`);
        }
      },
    },
  };
};

const credential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    {
      "@vocab": "http://example.com/terms#",
    },
  ],
  id: "https://example.com/credentials/1872",
  type: ["VerifiableCredential"],
  issuer: rawKeyJson.controller,
  issuanceDate: "2010-01-01T19:23:24Z",
  credentialSubject: {
    level1: "level1",
    type: "Foo",
    bar: {
      id: "urn:uuid:456",
      level2: "level2",
      baz: {
        level3: "level3",
      },
    },
  },
};

const createProof = async () => {
  keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
  suite = new Ed25519Signature2018({
    key: keyPair,
    date: credential.issuanceDate,
  });
  proof = await suite.createProof({
    document: credential,
    purpose,
    documentLoader,
    compactProof: false,
  });
};

const case0 = async () => {
  const result = await suite.verifyProof({
    proof,
    document: credential,
    purpose,
    documentLoader,
    compactProof: false,
  });
  //   note a "verified === false" is a failure here..
  if (!result.verified) {
    throw new Error("unable to verify trivial proof");
  }
};

// case 1 - we see if dropping terms on layer 1 causes a failure
// we expect to prove that such tampering breaks verification.
const case1 = async () => {
  expect(credential.credentialSubject.level1).toBeDefined();
  const tampered = JSON.parse(JSON.stringify(credential));
  delete tampered.credentialSubject.level1;
  expect(tampered.credentialSubject.level1).toBeUndefined();
  const result = await suite.verifyProof({
    proof,
    document: tampered,
    purpose,
    documentLoader,
    compactProof: false,
  });
  //   note a "verified === true" is a failure here..
  if (result.verified) {
    throw new Error(
      "expected tampering at layer 1 to cause credential verification to fail."
    );
  }
};

// case 2 - we see if dropping terms on layer 2 causes a failure
// we expect to prove that such tampering breaks verification.
const case2 = async () => {
  expect(credential.credentialSubject.bar).toBeDefined();
  const tampered = JSON.parse(JSON.stringify(credential));
  delete tampered.credentialSubject.bar;
  expect(tampered.credentialSubject.bar).toBeUndefined();
  expect(tampered).not.toEqual(credential);
  const result = await suite.verifyProof({
    proof,
    document: tampered,
    purpose,
    documentLoader,
    compactProof: false,
  });
  //   note a "verified === true" is a failure here..
  if (result.verified) {
    throw new Error(
      "expected tampering at layer 2 to cause credential verification to fail."
    );
  }
};

// case 3 - we see if dropping terms on layer 3 causes a failure
// we expect to prove that such tampering breaks verification.
const case3 = async () => {
  expect(credential.credentialSubject.bar.baz).toBeDefined();
  const tampered = JSON.parse(JSON.stringify(credential));
  delete tampered.credentialSubject.bar.baz;
  expect(tampered.credentialSubject.bar.baz).toBeUndefined();
  expect(tampered).not.toEqual(credential);
  const result = await suite.verifyProof({
    proof,
    document: tampered,
    purpose,
    documentLoader,
    compactProof: false,
  });
  //   note a "verified === true" is a failure here..
  if (result.verified) {
    throw new Error(
      "expected tampering at layer 3 to cause credential verification to fail."
    );
  }
};

(async () => {
  await createProof();
  await case0();
  await case1();
  await case2();
  await case3();
})();
