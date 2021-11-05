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
const documentLoader = require("./1-documentLoader");
const credential1 = require("../src/__fixtures__/1-credentials/case-1.json");
const credential2 = require("../src/__fixtures__/1-credentials/case-2.json");
const credential3 = require("../src/__fixtures__/1-credentials/case-3.json");
const credential4 = require("../src/__fixtures__/1-credentials/case-4.json");
const credential5 = require("../src/__fixtures__/1-credentials/case-5.json");
const credential6 = require("../src/__fixtures__/1-credentials/case-6.json");
const credential7 = require("../src/__fixtures__/1-credentials/case-7.json");
const credential8 = require("../src/__fixtures__/1-credentials/case-8.json");
const credential9 = require("../src/__fixtures__/1-credentials/case-9.json");
const credentials = [
  credential1,
  credential2,
  credential3,
  credential4,
  credential5,
  credential6,
  credential7,
  credential8,
  credential9,
];

const purpose = new jsigs.purposes.AssertionProofPurpose();

(async () => {
  let idx = 0;
  for (const credential of credentials) {
    idx++;
    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    let suite;
    try {
      if (credential.issuanceDate !== "" && credential.issuanceDate) {
        suite = new Ed25519Signature2018({
          key: keyPair,
          date: credential.issuanceDate,
        });
      } else {
        // fallback default date
        suite = new Ed25519Signature2018({
          key: keyPair,
          date: "2010-01-01T19:23:24Z",
        });
      }
    } catch (e) {
      // This will happen for invalid dates
      // Then we fallback on another date
      suite = new Ed25519Signature2018({
        key: keyPair,
        date: "2010-01-01T19:23:24Z",
      });
    }

    const verifiableCredential = await jsigs.sign(credential, {
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
          `../src/__fixtures__/1-verifiable-credentials/digital-bazaar/case-${idx}.json`
        ),
        JSON.stringify(verifiableCredential, null, 2)
      );
    } else {
      throw new Error(
        `Expected verifiable credential for case-${idx}.json to verify`
      );
    }
  }
})();
