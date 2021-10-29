const fs = require("fs");
const path = require("path");
const vc = require("@digitalbazaar/vc");
const {
  Ed25519VerificationKey2018,
} = require("@digitalbazaar/ed25519-verification-key-2018");
const {
  Ed25519Signature2018,
} = require("@digitalbazaar/ed25519-signature-2018");

const rawKeyJson = require("../src/__fixtures__/keys/key.json");
const documentLoader = require("./documentLoader");
const credential = require("../src/__fixtures__/credentials/case-1.json");

(async () => {
  const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
  const suite = new Ed25519Signature2018({
    key: keyPair,
    date: credential.issuanceDate,
  });
  const verifiableCredential = await vc.issue({
    credential,
    suite,
    documentLoader,
  });
  const result = await vc.verifyCredential({
    credential: verifiableCredential,
    suite: new Ed25519Signature2018({ key: keyPair }),
    documentLoader,
  });
  if (result.verified) {
    fs.writeFileSync(
      path.resolve(
        __dirname,
        `../src/__fixtures__/verifiable-credentials/digital-bazaar/case-1.json`
      ),
      JSON.stringify(verifiableCredential, null, 2)
    );
  } else {
    throw new Error("Expected verifiable credential for case-1.json to verify");
  }
})();
