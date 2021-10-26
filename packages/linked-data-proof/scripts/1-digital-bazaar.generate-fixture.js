const fs = require("fs");
const path = require("path");
const jsigs = require("jsonld-signatures");
const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");
const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");

const rawKeyJson = require("../src/__fixtures__/1-keys/key.json");
const credential1 = require("../src/__fixtures__/1-credentials/case-1.json");
const documentLoader = require("./1-documentLoader");

(async () => {
  const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
  const suite = new Ed25519Signature2018({
    key: keyPair,
    date: credential1.issuanceDate,
  });
  const purpose = {
    // ignore validation of dates and such...
    validate: () => {
      return { valid: true };
    },
    update: (proof) => {
      proof.proofPurpose = "assertionMethod";
      return proof;
    },
    match: async (proof, _options) => {
      return proof.proofPurpose === "assertionMethod";
    },
  };
  const verifiableCredential = await jsigs.sign(credential1, {
    suite,
    purpose,
    documentLoader,
    expansionMap: false,
    addSuiteContext: false, // don't add extra context
  });
  const result = await jsigs.verify(verifiableCredential, {
    suite: new Ed25519Signature2018({ key: keyPair }),
    purpose,
    documentLoader,
    expansionMap: false,
  });
  if (result.results[0].verified) {
    fs.writeFileSync(
      path.resolve(
        __dirname,
        "../src/__fixtures__/1-verifiable-credentials/digital-bazaar/case-1.json"
      ),
      JSON.stringify(verifiableCredential, null, 2)
    );
  } else {
    throw new Error("Expected verifiable credential for case-1.json to verify");
  }
})();
