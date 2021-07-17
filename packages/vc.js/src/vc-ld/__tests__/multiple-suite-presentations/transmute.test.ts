import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof
} from "@mattrglobal/jsonld-signatures-bbs";
import { ld as vc } from "../../..";
import * as fixtures from "./__fixtures__";

const expectProofsToBeEqual = (a: any, b: any) => {
  // because these signatures are not deterministic,
  // we cannot compare the full proof
  // so we delete the parts that change
  delete a.proof.created;
  delete a.proof.proofValue;
  delete a.proof.nonce;
  const unstable: any = JSON.parse(JSON.stringify(b));
  delete unstable.proof.created;
  delete unstable.proof.proofValue;
  delete unstable.proof.nonce;
  expect(a).toEqual(unstable);
};

let key: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;

// our lib, their suite.
beforeAll(async () => {
  key = await Bls12381G2KeyPair.from(fixtures.key as any);
  suite = new BbsBlsSignature2020({
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
  expectProofsToBeEqual(verifiableCredential, fixtures.verifiableCredential);
});

it("verify verifiable credential", async () => {
  const res = await vc.verifyVerifiableCredential({
    credential: fixtures.verifiableCredential,
    suite: new BbsBlsSignature2020(),
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});

it("derive verifiable credential", async () => {
  const derivedVerifiableCredential = await deriveProof(
    fixtures.verifiableCredential,
    fixtures.frame,
    {
      suite: new BbsBlsSignatureProof2020(),
      documentLoader: fixtures.documentLoader
    }
  );
  expectProofsToBeEqual(
    derivedVerifiableCredential,
    fixtures.derivedVerifiableCredential
  );
});

it("verify derived verifiable credential", async () => {
  const res = await vc.verifyVerifiableCredential({
    credential: fixtures.derivedVerifiableCredential,
    suite: new BbsBlsSignatureProof2020(),
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});

it("present verifiable credential", async () => {
  const verifiablePresentation = await vc.createVerifiablePresentation({
    presentation: {
      "@context": fixtures.verifiableCredential["@context"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [fixtures.derivedVerifiableCredential]
    },
    challenge: "123",
    suite,
    documentLoader: fixtures.documentLoader
  });

  expectProofsToBeEqual(
    verifiablePresentation,
    fixtures.verifiablePresentation
  );
});

it("verify presentation", async () => {
  const res = await vc.verifyVerifiablePresentation({
    presentation: fixtures.verifiablePresentation,
    challenge: "123",
    suite: [new BbsBlsSignature2020(), new BbsBlsSignatureProof2020()],
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});
