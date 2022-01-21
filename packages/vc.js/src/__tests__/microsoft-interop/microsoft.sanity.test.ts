import jwt from "./jwt.json";
import { JsonWebSignature } from "@transmute/json-web-signature";

import { documentLoader } from "./documentLoader";
import { verifiable } from "../../index";
const { compact } = jwt;

const { parseJwk } = require("jose/jwk/parse");
const { jwtVerify } = require("jose/jwt/verify");

describe("verify a microsoft vc", () => {
  let publicKeyJwk: any;
  it("can resolve an ion based did", async () => {
    const [encodedHeader, encodedPayload] = `${compact}`.split(".");
    const header = JSON.parse(Buffer.from(encodedHeader, "base64").toString());
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64").toString()
    );
    expect(header.alg).toBe("ES256K");
    expect(payload.iss).toBe(header.kid.split("#")[0]);
    const { document } = await documentLoader(header.kid);
    expect(document.id).toBe(payload.iss);
    ({ publicKeyJwk } = document.verificationMethod[0]);
  });

  it("can not verify vc-jwt issued by ION with npm jose if jwt expired", async () => {
    const publicKey = await parseJwk(publicKeyJwk, "ES256K");
    let failed = false;
    try {
      const { payload } = await jwtVerify(`${compact}`, publicKey);
      expect(payload.vc).toBeDefined();
    } catch (err) {
      failed = true;
    }
    expect(failed).toBeTruthy();
  });

  it("can verify vc-jwt issued by ION with transmute", async () => {
    const result = await verifiable.credential.verify({
      credential: compact,
      documentLoader: documentLoader as any,
      suite: [new JsonWebSignature()],
      format: ["vc-jwt"]
    });
    expect(result.verified).toBe(true);
  });
});
