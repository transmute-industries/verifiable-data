import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof
} from "@mattrglobal/jsonld-signatures-bbs";

import * as fixtures from "./__fixtures__";
import * as jsigs from "../..";

let key: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;

const purpose = new jsigs.purposes.AssertionProofPurpose();

beforeAll(async () => {
  key = await Bls12381G2KeyPair.from(fixtures.key as any);
  suite = new BbsBlsSignature2020({
    key,
    date: "2010-01-01T19:23:24Z"
  });
});

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

it("sign", async () => {
  const docSigned = await jsigs.sign(
    { ...fixtures.doc, issuer: { id: key.controller } },
    {
      suite,
      purpose,
      documentLoader: fixtures.documentLoader
    }
  );

  expectProofsToBeEqual(docSigned, fixtures.docSigned);
});

it("verify", async () => {
  const res = await jsigs.verify(
    { ...fixtures.docSigned },
    {
      suite: new BbsBlsSignature2020(),
      purpose: purpose,
      documentLoader: fixtures.documentLoader
    }
  );
  expect(res.verified).toBe(true);
});

it("derive", async () => {
  const docDerived = await deriveProof(fixtures.docSigned, fixtures.frame, {
    suite: new BbsBlsSignatureProof2020(),
    documentLoader: fixtures.documentLoader
  });
  expectProofsToBeEqual(docDerived, fixtures.docDerived);
});

it("verify", async () => {
  const res = await jsigs.verify(
    { ...fixtures.docDerived },
    {
      suite: new BbsBlsSignatureProof2020(),
      purpose: purpose,
      documentLoader: fixtures.documentLoader
    }
  );
  expect(res.verified).toBe(true);
});
