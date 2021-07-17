import { Ed25519VerificationKey2018 } from "@digitalbazaar/ed25519-verification-key-2018";
import { Ed25519Signature2018 } from "@digitalbazaar/ed25519-signature-2018";
import vc from "@digitalbazaar/vc";
import * as fixtures from "./__fixtures__";

let key: any;
let suite: any;

beforeAll(async () => {
  key = await Ed25519VerificationKey2018.from(fixtures.key);
  suite = new Ed25519Signature2018({
    key,
    date: "2010-01-01T19:23:24Z"
  });
});

it("issue verifiable credential", async () => {
  const docSigned = await vc.issue({
    credential: { ...fixtures.credential, issuer: { id: key.controller } },
    suite
  });
  expect(docSigned).toEqual(fixtures.verifiableCredential);
});

it("verify verifiable credential", async () => {
  const res = await vc.verifyCredential({
    credential: fixtures.verifiableCredential,
    suite: new Ed25519Signature2018(),
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});

it("present verifiable credential", async () => {
  const verifiablePresentation = await vc.signPresentation({
    presentation: {
      "@context": fixtures.verifiableCredential["@context"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [fixtures.verifiableCredential]
    },
    challenge: "123",
    suite
  });
  expect(verifiablePresentation).toEqual(fixtures.verifiablePresentation);
});

it("verify presentation", async () => {
  const res = await vc.verify({
    presentation: fixtures.verifiablePresentation,
    challenge: "123",
    suite,
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});
