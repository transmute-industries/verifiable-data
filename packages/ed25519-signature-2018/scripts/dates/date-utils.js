export const exampleCredential = {
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

export const createSuite = async (suiteDate) => {
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

export const signCredential = async (suite, unsignedCredential) => {
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
