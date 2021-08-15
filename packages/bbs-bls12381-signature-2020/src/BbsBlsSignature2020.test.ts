import { Bls12381G2KeyPair } from "@transmute/bls12381-key-pair";
import { keys, credentials, documentLoader } from "./__fixtures__";
import { BbsBlsSignature2020 } from "./BbsBlsSignature2020";

let k: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;

const document1 = { ...credentials.credential0 };

let proof1: any;

it("can parse jwks", async () => {
  k = await Bls12381G2KeyPair.from(keys.key0 as any);
  expect(k.publicKey).toBeInstanceOf(Uint8Array);
  expect(k.privateKey).toBeInstanceOf(Uint8Array);
  suite = new BbsBlsSignature2020({
    key: k,
    date: document1.issuanceDate
  });
});

it("can sign", async () => {
  proof1 = await suite.createProof({
    document: { ...document1 },
    purpose: {
      update: (proof: any) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      }
    },
    documentLoader
  });
  expect(proof1.type).toBe("BbsBlsSignature2020");
  expect(proof1.created).toBe(document1.issuanceDate);
  expect(proof1.verificationMethod).toBe(k.id);
  expect(proof1.proofPurpose).toBe("assertionMethod");
  expect(proof1.proofValue).toBeDefined();
});

it("can verify", async () => {
  const result = await suite.verifyProof({
    document: { ...document1 },
    proof: { ...proof1 },
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
