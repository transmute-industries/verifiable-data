const { parseJwk } = require("jose/jwk/parse");
const { jwtVerify } = require("jose/jwt/verify");

const key = require("./__fixtures__/key.json");

const credential = require("./__fixtures__/credential.json");

const {
  verifiableCredential
} = require("./__fixtures__/verifiableCredential.json");

(async () => {
  const publicKey = await parseJwk(key.publicKeyJwk, "EdDSA");
  const { payload } = await jwtVerify(verifiableCredential, publicKey);
  const vc = JSON.stringify(payload.vc, null, 2);
  const expectedVc = JSON.stringify(
    { ...credential, issuer: { id: key.controller } },
    null,
    2
  );

  if (vc !== expectedVc) {
    console.log("found: ", vc);
    console.log("expected: ", expectedVc);
    throw new Error("VC did not match expectation...");
  }

  console.log("✅ tests pass.");
})();
