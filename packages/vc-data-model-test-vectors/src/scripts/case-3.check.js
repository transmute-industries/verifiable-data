const fs = require("fs");
const path = require("path");

const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");

const credential3 = require("../credentials/credential-3.json");
const proof = require("../vectors/credential-3--key-0.json");
const documentLoader = require("../utils/documentLoader");

const group = (verified) => {
  return verified ? "pass" : "fail";
};

const createCase = async () => {
  const suite = new Ed25519Signature2018();
  const purpose = {
    validate: () => {
      return { valid: true };
    },
    update: (proof) => {
      proof.proofPurpose = "assertionMethod";
      return proof;
    },
  };
  let result;
  const checks = {
    credential: credential3,
    proof,
    tests: {
      pass: [],
      fail: [],
    },
  };

  result = await suite.verifyProof({
    proof,
    document: credential3,
    purpose,
    documentLoader,
    compactProof: false,
  });
  checks.tests[group(result.verified)].push(
    "should verify when json has not changed"
  );

  const tampered1 = JSON.parse(JSON.stringify(credential3));
  tampered1.issuanceDate = "2020-01-01T19:23:24Z";

  result = await suite.verifyProof({
    proof,
    document: tampered1,
    purpose,
    documentLoader,
    compactProof: false,
  });
  checks.tests[group(!result.verified)].push(
    "should fail to verify when issuanceDate is changed"
  );

  const tampered2 = JSON.parse(JSON.stringify(credential3));
  tampered2.credentialSubject.id = "did:example:456";
  result = await suite.verifyProof({
    proof,
    document: tampered2,
    purpose,
    documentLoader,
    compactProof: false,
  });
  checks.tests[group(!result.verified)].push(
    "should fail to verify when subject is changed"
  );

  const tampered3 = JSON.parse(JSON.stringify(credential3));
  tampered3.credentialSubject.manufacturer.name = "FOO BAR";
  result = await suite.verifyProof({
    proof,
    document: tampered3,
    purpose,
    documentLoader,
    compactProof: false,
  });
  checks.tests[group(!result.verified)].push(
    "should fail to verify when manufacturer name is changed"
  );

  const tampered4 = JSON.parse(
    JSON.stringify({
      type: ["VerifiableCredential"],
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/traceability/v1",
      ],
      credentialSubject: {},
      id: "http://localhost:8080/credentials/61858f5a-682a-4857-b759-f3487bae0658",
      issuanceDate: "2010-01-01T19:23:24Z",
    })
  );

  result = await suite.verifyProof({
    proof,
    document: tampered4,
    purpose,
    documentLoader,
    compactProof: false,
  });
  checks.tests[group(!result.verified)].push(
    "should fail to verify when credential is wildly different"
  );

  const vectorName = "credential-3--key-0--check";
  const vectorValue = JSON.stringify(checks, null, 2);
  fs.writeFileSync(
    path.resolve(__dirname, "../vectors/" + vectorName + ".json"),
    vectorValue
  );
};

module.exports = createCase;
