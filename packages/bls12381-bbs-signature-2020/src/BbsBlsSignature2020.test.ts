import { Bls12381G2KeyPair } from "@transmute/bls12381-key-pair";
import { keys, credentials, documentLoader } from "./__fixtures__";
import { BbsBlsSignature2020 } from "./BbsBlsSignature2020";

let k: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;
let proof: any;

it("can parse jwks", async () => {
  k = await Bls12381G2KeyPair.from(keys.key0 as any);
  expect(k.publicKey).toBeInstanceOf(Uint8Array);
  expect(k.privateKey).toBeInstanceOf(Uint8Array);
  suite = new BbsBlsSignature2020({
    key: k,
    date: credentials.credential0.issuanceDate,
  });
});

it("can sign", async () => {
  proof = await suite.createProof({
    document: credentials.credential0,
    purpose: {
      update: (proof: any) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      },
    },
    documentLoader,
  });
  expect(proof.type).toBe("BbsBlsSignature2020");
  expect(proof.created).toBe(credentials.credential0.issuanceDate);
  expect(proof.verificationMethod).toBe(k.id);
  expect(proof.proofPurpose).toBe("assertionMethod");
  expect(proof.proofValue).toBeDefined();
});

it("can verify", async () => {
  const result = await suite.verifyProof({
    document: credentials.credential0,
    proof: {
      "@context": credentials.credential0["@context"],
      ...proof,
    },
    purpose: {
      // ignore validation of dates and such...
      validate: () => {
        return { valid: true };
      },
      update: (proof: any) => {
        proof.proofPurpose = "assertionMethod";
        return proof;
      },
    },
    documentLoader,
  });
  expect(result.verified).toBe(true);

  console.log(
    JSON.stringify(
      {
        ...credentials.credential0,
        proof: {
          "@context": credentials.credential0["@context"],
          ...proof,
        },
      },
      null,
      2
    )
  );
});
