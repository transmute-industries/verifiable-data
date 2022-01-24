import { CompactSign } from "jose/jws/compact/sign";
import { parseJwk } from "jose/jwk/parse";

import { compactVerify } from "jose/jws/compact/verify";
// import fs from "fs";
// import path from "path";

const encoder = new TextEncoder();
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

const sign = async (header: any, payload: any, privateKeyJwk: any) => {
  const alg = crvToAlg[privateKeyJwk.crv];
  const jws = await new CompactSign(
    encoder.encode(
      typeof payload === "string" ? payload : JSON.stringify(payload)
    )
  )
    .setProtectedHeader({ ...header, alg })
    .sign(await parseJwk(privateKeyJwk, alg));
  return jws;
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
        it(`simple`, async () => {
          const {
            payload
          } = require("./__fixtures__/simple-string-payload.json");
          const header = { kid: "did:example:123#" + alg };
          const jws = await sign(header, payload, privateKeyJwk);
          const verified = await verify(jws, privateKeyJwk);
          expect(verified).toBe(true);

          // fs.writeFileSync(
          //   path.resolve(__dirname, `./__fixtures__/${alg}.simple.signed.json`),
          //   JSON.stringify({ jws }, null, 2)
          // );
        });

        it(`complex`, async () => {
          const payload = require("./__fixtures__/complex-object-payload.json");
          const header = { kid: "did:example:123#" + alg };
          const jws = await sign(header, payload, privateKeyJwk);
          const verified = await verify(jws, privateKeyJwk);
          expect(verified).toBe(true);
          // fs.writeFileSync(
          //   path.resolve(
          //     __dirname,
          //     `./__fixtures__/${alg}.complex.signed.json`
          //   ),
          //   JSON.stringify({ jws }, null, 2)
          // );
        });
      });
    });
  });
});
