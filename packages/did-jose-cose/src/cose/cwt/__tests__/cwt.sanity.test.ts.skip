const CWT = require("cwt-js");

const signKey = {
  d: Buffer.from(
    "6c1382765aec5358f117733d281c1c7bdc39884d04a45a1e6c67c858bc206c19",
    "hex"
  ),
  kid: "AsymmetricECDSA256",
};
const verifyKey = {
  x: Buffer.from(
    "143329cce7868e416927599cf65a34f3ce2ffda55a7eca69ed8919a394d42f0f",
    "hex"
  ),
  y: Buffer.from(
    "60f7f1a780d8a783bfb7a2dd6b2796e8128dbbcef9d3d168db9529971a36e7b9",
    "hex"
  ),
  kid: "AsymmetricECDSA256",
};

const alg = "ES256";
const claims = {
  iss: "coap://as.example.com",
  sub: "erikw",
  aud: "coap://light.example.com",
  exp: 1444064944,
  nbf: 1443944944,
  iat: 1443944944,
  cti: "0b71",
};

it("can sign and verify", async () => {
  const cwt = new CWT(claims);
  const signature = await cwt.sign(signKey, alg);
  const verification = await CWT.parse(signature.data, verifyKey);
  expect(verification.done).toBe(true);
});
