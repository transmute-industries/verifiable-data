const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");
const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");
const fs = require('fs');
const path = require('path');
const rawKeyJson = require("../src/__fixtures__/key.json");
const documentLoader = require("./documentLoader");

let keyPair;
let suite;
let proof;
const credential = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  id: "https://example.com/credentials/1872",
  type: ["VerifiableCredential"],
  issuer: rawKeyJson.controller,
  issuanceDate: "2010-01-01T19:23:24Z",
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
  },
};

(async () => {
  keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);

  suite = new Ed25519Signature2018({
    key: keyPair,
    date: credential.issuanceDate,
  });

  //
  proof = await suite.createProof({
    document: credential,
    purpose: {
      // ignore validation of dates and such...
      validate: () => {
        return { valid: true };
      },
      update: (proof) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      },
    },
    documentLoader,
    // expansionMap,
    compactProof: false,
  });

  //
  const result = await suite.verifyProof({
    proof,
    document: credential,
    purpose: {
      // ignore validation of dates and such...
      validate: () => {
        return { valid: true };
      },
      update: (proof) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      },
    },
    documentLoader,
    // expansionMap,
    compactProof: false,
  });

  if (result.verified) {
    fs.writeFileSync(
      path.resolve(__dirname, "../src/__fixtures__/proof.json"),
      JSON.stringify(proof, null, 2)
    );
  }
})();

//
