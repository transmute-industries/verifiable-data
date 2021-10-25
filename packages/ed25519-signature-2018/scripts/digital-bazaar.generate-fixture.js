const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");
const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");
const fs = require("fs");
const path = require("path");
const rawKeyJson = require("../src/__fixtures__/keys/key.json");
const documentLoader = require("./documentLoader");
const credential1 = require("../src/__fixtures__/credentials/case-1.json");
const credential2 = require("../src/__fixtures__/credentials/case-2.json");
const credential3 = require("../src/__fixtures__/credentials/case-3.json");
const credential4 = require("../src/__fixtures__/credentials/case-4.json");
const credential5 = require("../src/__fixtures__/credentials/case-5.json");
const credential6 = require("../src/__fixtures__/credentials/case-6.json");
const credentials = [
  credential1,
  credential2,
  credential3,
  credential4,
  credential5,
  credential6,
];

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

let keyPair;
let suite;
let proof;

(async () => {
  let idx = 0;
  for (const credential of credentials) {
    idx++;
    keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);

    suite = new Ed25519Signature2018({
      key: keyPair,
      date: credential.issuanceDate,
    });

    proof = await suite.createProof({
      document: credential,
      purpose,
      documentLoader,
      // expansionMap,
      compactProof: false,
    });

    const result = await suite.verifyProof({
      proof,
      document: credential,
      purpose,
      documentLoader,
      // expansionMap,
      compactProof: false,
    });

    if (result.verified) {
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `../src/__fixtures__/proofs/digital-bazaar/case-${idx}.json`
        ),
        JSON.stringify(proof, null, 2)
      );
    } else {
      throw new Error(
        `Expected proof for case-${idx}.json to verify`
      );
    }
  }
})();
