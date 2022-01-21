import { verifiable } from "../../index";
import { JsonWebSignature } from "@transmute/json-web-signature";
import { documentLoader } from "./documentLoader";

const signatures = [
  require("./__fixtures__/ES256K.simple.signed.json"),
  require("./__fixtures__/ES256K.complex.signed.json"),
  //
  require("./__fixtures__/EdDSA.simple.signed.json"),
  require("./__fixtures__/EdDSA.complex.signed.json"),
  //
  require("./__fixtures__/ES384.simple.signed.json"),
  require("./__fixtures__/ES384.complex.signed.json")
];

it("can verify", async () => {
  const result = await verifiable.credential.verify({
    credential: signatures[1].jws,
    format: ["vc-jwt"],
    documentLoader: documentLoader as any,
    suite: new JsonWebSignature()
  });
  expect(result.verified).toBe(true);
});
