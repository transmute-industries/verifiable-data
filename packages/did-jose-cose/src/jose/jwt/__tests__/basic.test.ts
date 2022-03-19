import { jose, SigningKey } from "../../../index";
import { jsonWebKey, documentLoader } from "../../../__fixtures__";

it("JWT sign and verify", async () => {
  const { id, privateKeyJwk } = jsonWebKey as SigningKey;
  const header = { kid: id };
  const payload = {
    iss: "coap://as.example.com",
    sub: "erikw",
    aud: "coap://light.example.com",
    exp: 2444064944,
    nbf: 1443944944,
    iat: 1443944944,
    jti: "0b71",
  };
  const jwt = await jose.jwt.sign(header, payload, privateKeyJwk);
  const v = await jose.jwt.verify(jwt, id, documentLoader);
  expect(v.verified).toBe(true);
  expect(v.payload).toBeDefined();
});
