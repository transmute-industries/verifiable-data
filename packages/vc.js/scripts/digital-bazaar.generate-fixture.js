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
  const presentation = vc.createPresentation({
    verifiableCredential,
    holder: credential.issuer,
  });
  const challenge = "fcc8b78e-ecca-426a-a69f-8e7c927b845f";
  const domain = "org_123";
  const verifiablePresentation = await vc.signPresentation({
    presentation,
    suite,
    challenge,
    domain,
    documentLoader,
  });
  const result2 = await vc.verify({
    presentation: verifiablePresentation,
    challenge,
    domain,
    suite: new Ed25519Signature2018({ key: keyPair }),
    documentLoader,
  });
  if (result2.verified) {
    fs.writeFileSync(
      path.resolve(
        __dirname,
        `../src/__fixtures__/verifiable-presentations/digital-bazaar/case-1.json`
      ),
      JSON.stringify(verifiablePresentation, null, 2)
    );
  } else {
    throw new Error(
      "Expected verifiable presentation for case-1.json to verify"
    );
  }
})();
