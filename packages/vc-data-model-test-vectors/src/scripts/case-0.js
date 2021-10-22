const fs = require("fs");
const path = require("path");
const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");

const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");

const key0 = require("../keys/key-0.json");
const credential0 = require("../credentials/credential-0.json");
const documentLoader = require("../utils/documentLoader");

const createCase = async () => {
  const keyPair = await Ed25519VerificationKey2018.from(key0);
  const suite = new Ed25519Signature2018({
    key: keyPair,
    date: credential0.issuanceDate,
  });

  const proof = await suite.createProof({
    document: credential0,
    purpose: {
      validate: () => {
        return { valid: true };
      },
      update: (proof) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      },
    },
    documentLoader,
    compactProof: false,
  });

  const vectorName = "credential-0--key-0";
  const vectorValue = JSON.stringify(proof, null, 2);
  fs.writeFileSync(
    path.resolve(__dirname, "../vectors/" + vectorName + ".json"),
    vectorValue
  );
};

module.exports = createCase;
