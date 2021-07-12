import {
  Ed25519VerificationKey2018,
  Ed25519Signature2018
} from "@transmute/ed25519-signature-2018";

import { ld as vc } from "../../..";
import * as fixtures from "./__fixtures__";

let key: any;
let suite: any;

// our library with our suites
beforeAll(async () => {
  key = await Ed25519VerificationKey2018.from(fixtures.key);
  suite = new Ed25519Signature2018({
    key,
    date: "2010-01-01T19:23:24Z"
  });
});

it("issue verifiable credential", async () => {
  const verifiableCredential = await vc.createVerifiableCredential({
    credential: { ...fixtures.credential, issuer: { id: key.controller } },
    suite,
    documentLoader: fixtures.documentLoader
  });
  expect(verifiableCredential).toEqual(fixtures.verifiableCredential);
});

it("verify verifiable credential", async () => {
  const res = await vc.verifyVerifiableCredential({
    credential: fixtures.verifiableCredential,
    suite: new Ed25519Signature2018(),
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
    documentLoader: fixtures.documentLoader
  });
  expect(verifiablePresentation).toEqual(fixtures.verifiablePresentation);
});

it("verify presentation", async () => {
  const res = await vc.verifyVerifiablePresentation({
    presentation: fixtures.verifiablePresentation,
    challenge: "123",
    suite,
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});
