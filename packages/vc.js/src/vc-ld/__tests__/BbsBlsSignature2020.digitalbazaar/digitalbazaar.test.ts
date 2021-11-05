import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020
} from "@transmute/bbs-bls12381-signature-2020";
import vc from "@digitalbazaar/vc";
import * as fixtures from "./__fixtures__";

let key: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;
let verifiableCredential: any;
let verifiablePresentation: any;
beforeAll(async () => {
  key = await Bls12381G2KeyPair.from(fixtures.key as any);
  suite = new BbsBlsSignature2020({
    key,
    date: "2010-01-01T19:23:24Z"
  });
});

it("issue verifiable credential", async () => {
  verifiableCredential = await vc.issue({
    credential: { ...fixtures.credential, issuer: { id: key.controller } },
    suite,
    documentLoader: fixtures.documentLoader
  });
});

it("verify verifiable credential", async () => {
  const res = await vc.verifyCredential({
    credential: { ...verifiableCredential },
    suite: new BbsBlsSignature2020(),
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});

it("present verifiable credential", async () => {
  verifiablePresentation = await vc.signPresentation({
    presentation: {
      "@context": verifiableCredential["@context"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [verifiableCredential]
    },
    challenge: "123",
    suite,
    documentLoader: fixtures.documentLoader
  });
});

it("verify presentation", async () => {
  const res = await vc.verify({
    presentation: { ...verifiablePresentation },
    challenge: "123",
    suite,
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});
