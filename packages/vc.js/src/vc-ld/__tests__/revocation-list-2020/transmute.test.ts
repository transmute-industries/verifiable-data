import { Ed25519Signature2018 } from "@transmute/ed25519-signature-2018";
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

it("issue verifiable credential", async () => {
  const docSigned = await vc.createVerifiableCredential({
    credential: { ...fixtures.credential, issuer: { id: key.controller } },
    suite,
    documentLoader: fixtures.documentLoader // required since custom suite.
  });
  expect(docSigned).toEqual(fixtures.verifiableCredential);
});

it("verify verifiable credential", async () => {
  const res = await vc.verifyVerifiableCredential({
    credential: fixtures.verifiableCredential,
    suite: [new JsonWebSignature(), new Ed25519Signature2018()],
    checkStatus: fixtures.checkStatus.checkStatus1,
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});

it("present verifiable credential", async () => {
  const verifiablePresentation = await vc.createVerifiablePresentation({
    presentation: {
      "@context": fixtures.verifiableCredential["@context"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [fixtures.verifiableCredential]
    },
    challenge: "123",
    suite,
    documentLoader: fixtures.documentLoader // required since custom suite.
  });
  expect(verifiablePresentation).toEqual(fixtures.verifiablePresentation);
});

it("verify presentation", async () => {
  const res = await vc.verifyVerifiablePresentation({
    presentation: fixtures.verifiablePresentation,
    challenge: "123",
    suite: [new JsonWebSignature(), new Ed25519Signature2018()],
    checkStatus: fixtures.checkStatus.checkStatus1,
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});
