import * as fixtures from "./__fixtures__";
import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof
} from "@mattrglobal/jsonld-signatures-bbs";

import { verifiable } from "../..";

let key: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;

beforeAll(async () => {
  key = await Bls12381G2KeyPair.from(fixtures.unRegisteredKeys[0]);
  suite = new BbsBlsSignature2020({
    key,
    date: fixtures.credential.issuanceDate
  });
});

let credential: any;
it("can create credential", async () => {
  const result = await verifiable.credential.create({
    credential: {
      ...fixtures.credential,
      issuer: { id: key.controller } as any // make sure issuer is set correctly
    },
    format: ["vc"],
    documentLoader: fixtures.documentLoader,
    suite: suite
  });
  credential = result.items[0];
});

it("can verify credential", async () => {
  const result = await verifiable.credential.verify({
    credential,
    format: ["vc"],
    documentLoader: fixtures.documentLoader,
    suite: suite
  });
  expect(result.verified).toBe(true);
});

let derivedCredential: any;

it("can derive credential", async () => {
  derivedCredential = await deriveProof(credential, fixtures.frame, {
    documentLoader: fixtures.documentLoader,
    suite: new BbsBlsSignatureProof2020()
  });
});

it("can verify derived credential", async () => {
  const result = await verifiable.credential.verify({
    credential: derivedCredential,
    format: ["vc"],
    documentLoader: fixtures.documentLoader,
    suite: new BbsBlsSignatureProof2020() as any
  });
  expect(result.verified).toBe(true);
});
