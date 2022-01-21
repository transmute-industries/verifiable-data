import { verifiable } from "../../index";
import { JsonWebKey, JsonWebSignature } from "@transmute/json-web-signature";
import { documentLoader } from "./documentLoader";

import { parseJwk } from "jose/jwk/parse";
import { compactVerify } from "jose/jws/compact/verify";

const privateKeys = [
  require("./__fixtures__/ES256K.privateKeyJwk.json"),
  require("./__fixtures__/EdDSA.privateKeyJwk.json"),
  require("./__fixtures__/ES384.privateKeyJwk.json")
];

const crvToAlg: any = {
  Ed25519: "EdDSA",
  secp256k1: "ES256K",
  "P-384": "ES384"
};

const verify = async (jws: string, publicKeyJwk: any) => {
  const alg = crvToAlg[publicKeyJwk.crv];
  let verified = false;
  try {
    const { protectedHeader } = await compactVerify(
      jws,
      await parseJwk(publicKeyJwk, alg)
    );
    if (protectedHeader.alg !== alg) {
      throw new Error("Invalid alg.");
    }
    verified = true;
  } catch (e) {
    verified = false;
  }
  return verified;
};

describe("JWS", () => {
  privateKeys.forEach(privateKeyJwk => {
    describe(`${privateKeyJwk.kty} ${privateKeyJwk.crv}`, () => {
      const alg = crvToAlg[privateKeyJwk.crv];
      describe(`can sign and verify with ${alg}`, () => {
        it(`complex`, async () => {
          const payload = require("./__fixtures__/complex-object-payload.json");
          const publicKeyJwk = { ...privateKeyJwk };
          delete publicKeyJwk.d;
          const {
            items: [jws]
          }: any = await verifiable.credential.create({
            credential: {
              ...payload.vc,
              issuer: "did:example:123" // issuer is a required field...
            },
            format: ["vc-jwt"],
            documentLoader: documentLoader as any,
            strict: "ignore",
            suite: new JsonWebSignature({
              key: await JsonWebKey.from({
                id: "did:example:123#" + alg,
                type: "JsonWebKey2020",
                controller: "did:example:123",
                privateKeyJwk,
                publicKeyJwk
              })
            })
          });
          const verified = await verify(jws, publicKeyJwk);
          expect(verified).toBe(true);
        });
      });
    });
  });
});
