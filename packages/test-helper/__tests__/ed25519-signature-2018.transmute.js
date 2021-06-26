const fs = require("fs");
const path = require("path");

const { documentLoader } = require("../__fixtures__/documentLoader");

const vcjs = require("@transmute/vc.js").ld;

const {
  Ed25519Signature2018,
  EdDsaEd25519KeyPair,
} = require("@transmute/ed25519-signature-2018");

// const { Ed25519KeyPair } = require("@transmute/ed25519-key-pair");

(async () => {
  const key = await EdDsaEd25519KeyPair.from(
    require("../__fixtures__/key-ld.json")
  );

  const suite = new Ed25519Signature2018({
    key,
    date: "2010-01-01T19:23:24Z",
  });

  const vc = await vcjs.issue({
    credential: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "http://example.edu/credentials/3732",
      type: ["VerifiableCredential"],
      issuer: {
        id: key.controller,
      },
      issuanceDate: "2010-01-01T19:23:24Z",
      credentialSubject: {
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
      },
    },
    suite,
    documentLoader,
  });

  // console.log(JSON.stringify(vc, null, 2));

  if (
    JSON.stringify(vc) !==
    JSON.stringify(require("../__fixtures__/ed25519-signaturee-2018.json"))
  ) {
    console.error("credential does not match fixture");
    process.exit(1);
  }

  const { verified } = await vcjs.verifyCredential({
    credential: vc,
    suite: new Ed25519Signature2018(),
    documentLoader,
  });

  if (!verified) {
    console.error("credential could not be verified");
    process.exit(1);
  }

  // fs.writeFileSync(
  //   path.join(__dirname, "../__fixtures__/ed25519-signaturee-2018.json"),
  //   JSON.stringify(vc, null, 2)
  // );
})();
