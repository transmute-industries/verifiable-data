import { JsonWebKey, JsonWebSignature } from "@transmute/json-web-signature";

import * as vcjs from "..";
import jwk from "../__fixtures__/keys/jwk.json";
import documentLoader from "../__fixtures__/documentLoader";

const isoStringNoMS = (date: any) => date.toISOString().split(".")[0] + "Z";
let verifiableCredential: any;
let suite: any;
describe("create and verify verifiable credentials", () => {
  it("create verifiable credential", async () => {
    suite = await new JsonWebSignature({
      key: await JsonWebKey.from(jwk as any, { detached: true }),
      date: new Date()
    });
    const issuerDid = suite.key?.controller;
    const {
      items: [vcJwt]
    } = await vcjs.verifiable.credential.create({
      credential: {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        type: ["VerifiableCredential"],
        issuer: {
          id: issuerDid!
        },
        issuanceDate: isoStringNoMS(new Date()),
        credentialSubject: {
          id: issuerDid
        }
      },
      format: ["vc-jwt"],
      suite,
      documentLoader: documentLoader as any
    });
    const [encodedHeader] = vcJwt.split(".");
    const header = JSON.parse(
      Buffer.from(encodedHeader, "base64").toString("ascii")
    );
    expect(header.alg).toEqual("ES256K-R");
    verifiableCredential = vcJwt;
  });

  it("verify verifiable credential", async () => {
    const result = await vcjs.verifiable.credential.verify({
      credential: verifiableCredential,
      format: ["vc-jwt"],
      documentLoader,
      suite
    });
    expect(result.verified).toBeTruthy();
  });
});
