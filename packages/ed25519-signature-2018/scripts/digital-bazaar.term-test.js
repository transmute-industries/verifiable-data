const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");
const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");
const rawKeyJson = require("../src/__fixtures__/keys/key.json");
const documentLoader = require("./documentLoader");
const credential = require("../src/__fixtures__/credentials/case-3.json");
const credential2 = require("../src/__fixtures__/credentials/case-5.json");

let keyPair;
let suite;
let suite2;
let proof;
let proof2;

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
  suite2 = new Ed25519Signature2018({
    key: keyPair,
    date: credential2.issuanceDate,
  });
  proof2 = await suite2.createProof({
    document: credential2,
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

// case 2 - we see if dropping terms on layer 1 causes a failure
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
      "expected tampering at layer 1 to cause credential verification to fail."
    );
  }
};

// case 3 - we see if dropping terms on layer 2 causes a failure
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
      "expected tampering at layer 2 to cause credential verification to fail."
    );
  }
};

// case 4 - we see if dropping terms on layer 3 causes a failure
// we expect to prove that such tampering breaks verification.
const case4 = async () => {
  expect(credential.credentialSubject.bar.baz.level3).toBeDefined();
  const tampered = JSON.parse(JSON.stringify(credential));
  delete tampered.credentialSubject.bar.baz.level3;
  expect(tampered.credentialSubject.bar.baz.level3).toBeUndefined();
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

// case 5 - we see if adding terms on layer 1 causes a failure
// we expect to prove that such tampering breaks verification.
const case5 = async () => {
  expect(credential.credentialSubject.thingamajig).toBeUndefined();
  const tampered = JSON.parse(JSON.stringify(credential));
  tampered.credentialSubject.thingamajig = 'thingamabob';
  expect(tampered.credentialSubject.thingamajig).toBeDefined();
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
      "expected tampering at layer 1 to cause credential verification to fail."
    );
  }
};

const case6 = async () => {
  const result = await suite2.verifyProof({
    proof: proof2,
    document: credential2,
    purpose,
    documentLoader,
    compactProof: false,
  });
  //   note a "verified === false" is a failure here..
  if (!result.verified) {
    throw new Error("unable to verify trivial proof");
  }
};

const case7 = async () => {
  expect(credential2.issuanceDate).toBeDefined();
  const tampered = JSON.parse(JSON.stringify(credential2));
  delete tampered.issuanceDate;
  expect(tampered.issuanceDate).toBeUndefined();
  expect(tampered).not.toEqual(credential2);
  const result = await suite2.verifyProof({
    proof: proof2,
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

const case8 = async () => {
  expect(credential2.issuanceDate).toBeDefined();
  const tampered = JSON.parse(JSON.stringify(credential2));
  tampered.issuanceDate = '2021-10-25T20:49:45Z';
  expect(tampered.issuanceDate).toBeDefined();
  expect(tampered).not.toEqual(credential2);
  const result = await suite2.verifyProof({
    proof: proof2,
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

const case9 = async () => {
  expect(credential2.credentialSubject.referenceNumber).toBeUndefined();
  const tampered = JSON.parse(JSON.stringify(credential2));
  tampered.referenceNumber = 83294847;
  expect(tampered.referenceNumber).toBeDefined();
  expect(tampered).not.toEqual(credential2);
  const result = await suite2.verifyProof({
    proof: proof2,
    document: tampered,
    purpose,
    documentLoader,
    compactProof: false,
  });
  //   note a "verified === true" is a failure here..
  if (!result.verified) {
    throw new Error(
      "expected proof to verify since added field not in context."
    );
  }
};

(async () => {
  await createProof();
  await case0();
  await case1();
  await case2();
  await case3();
  await case4();
  await case5();
  await case6();
  await case7();
  await case8();
  await case9();
})();
