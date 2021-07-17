import { JsonWebKey, JsonWebSignature } from "@transmute/json-web-signature";
import { ld as vc } from "../../..";

import * as fixtures from "./__fixtures__";

let key: JsonWebKey;
let suite: JsonWebSignature;

// our lib, our suite.
beforeAll(async () => {
  key = await JsonWebKey.from(fixtures.key as any);
  suite = new JsonWebSignature({
    key,
    date: "2010-01-01T19:23:24Z"
  });
});

it("should fail to verify invalid json ld signed presentation", async () => {
  const res = await vc.verifyVerifiablePresentation({
    presentation: {
      ...fixtures.verifiablePresentation,
      "@context": ["https://www.w3.org/2018/credentials/v1"]
    },
    suite,
    strict: "ignore",
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(false);
  expect(res.errors[0].message).toBe(`presentation is not valid JSON-LD: {
  "type": "MISSING_PROPERTIES_IN_CONTEXT",
  "details": [
    "proof.challenge",
    "proof.created",
    "proof.jws",
    "proof.proofPurpose",
    "proof.verificationMethod"
  ]
}`);
});

it("should fail to verify tampered signed presentation", async () => {
  const res = await vc.verifyVerifiablePresentation({
    presentation: {
      ...fixtures.verifiablePresentation,
      proof: {
        ...fixtures.verifiablePresentation.proof,
        jws: fixtures.verifiablePresentation.proof.jws + "added"
      }
    },
    suite,
    strict: "ignore",
    challenge: fixtures.verifiablePresentation.proof.challenge,
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(false);
  expect(res.errors[0].results[0].error.message).toBe("Invalid signature.");
});
