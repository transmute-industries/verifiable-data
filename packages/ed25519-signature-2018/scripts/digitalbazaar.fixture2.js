const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");
const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");
const fs = require("fs");
const path = require("path");
const rawKeyJson = require("../src/__fixtures__/key.json");
const documentLoader = require("./documentLoader");
const vc = require("../src/__fixtures__/vcs/mavennet-vc.json");

const credential = JSON.parse(JSON.stringify(vc));
delete credential.proof;
let keyPair;
let suite;
let proof;

(async () => {
  keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
  suite = new Ed25519Signature2018({
    key: keyPair,
    date: '2021-10-19T19:47:38Z',
  });
  proof = await suite.createProof({
    document: credential,
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
  const result = await suite.verifyProof({
    proof,
    document: credential,
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

  if (result.verified) {
    fs.writeFileSync(
      path.resolve(__dirname, "../src/__fixtures__/proof2.json"),
      JSON.stringify(proof, null, 2)
    );
  }
})();
