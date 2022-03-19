import { cose, SigningKey } from "../../../index";
import { jsonWebKey, documentLoader } from "../../../__fixtures__";

jest.setTimeout(10 * 1000);
it("CWT sign and verify", async () => {
  const { id, privateKeyJwk } = jsonWebKey as SigningKey;
  const header = { kid: id };
  const payload = {
    iss: "coap://as.example.com",
    sub: "erikw",
    aud: "coap://light.example.com",
    exp: 1444064944,
    nbf: 1443944944,
    iat: 1443944944,
    cti: "0b71",
  };
  const cwt = await cose.cwt.sign(header, payload, privateKeyJwk);
  const v = await cose.cwt.verify(cwt, id, documentLoader);
  expect(v.verified).toBe(true);
  expect(v.payload).toBeDefined();
});
