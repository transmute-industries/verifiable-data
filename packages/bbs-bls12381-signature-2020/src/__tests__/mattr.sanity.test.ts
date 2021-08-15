import {
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020
} from "@mattrglobal/jsonld-signatures-bbs";

import { Bls12381G2KeyPair } from "@mattrglobal/bls12381-key-pair";
import { keys, credentials, frames, documentLoader } from "../__fixtures__";

let key: Bls12381G2KeyPair;
let suite1: BbsBlsSignature2020;
let suite2: BbsBlsSignatureProof2020;

let document1: any = { ...credentials.credential0 };
let document2: any;

let proof1: any;
let proof2: any;

it("can parse jwks", async () => {
  key = await Bls12381G2KeyPair.from(keys.key1 as any);
  suite1 = new BbsBlsSignature2020({
    key: key,
    date: document1.issuanceDate
  });
  suite2 = new BbsBlsSignatureProof2020();
});

it("create proof", async () => {
  proof1 = await suite1.createProof({
    document: document1,
    purpose: {
      update: (proof: any) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      }
    },
    documentLoader,
    compactProof: true
  });
  expect(proof1.type).toBe("sec:BbsBlsSignature2020");
});

it("verify proof", async () => {
  const result = (await suite1.verifyProof({
    document: credentials.credential0,
    proof: proof1,
    purpose: {
      // ignore validation of dates and such...
      validate: () => {
        return { valid: true };
      },
      update: (proof: any) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      }
    },
    documentLoader
  })) as { verified: boolean };
  expect(result.verified).toBe(true);
});

it("derive proof", async () => {
  const result: any = await suite2.deriveProof({
    document: document1,
    proof: proof1,
    revealDocument: frames.frame0,
    documentLoader
  });
  expect(result.document).toBeDefined();
  expect(result.proof).toBeDefined();
  proof2 = result.proof;
  document2 = result.document;

  // console.log(
  //   JSON.stringify(
  //     {
  //       ...document2,
  //       proof: proof2,
  //     },
  //     null,
  //     2
  //   )
  // );
});

it("verify derived proof", async () => {
  const result = await suite2.verifyProof({
    document: document2,
    proof: proof2,
    purpose: {
      // ignore validation of dates and such...
      validate: () => {
        return { valid: true };
      },
      update: (proof: any) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      }
    },
    documentLoader
  });
  expect(result.verified).toBe(true);
});
