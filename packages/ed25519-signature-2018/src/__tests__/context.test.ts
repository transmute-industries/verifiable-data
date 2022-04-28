import { Ed25519KeyPair } from "@transmute/ed25519-key-pair";
import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import { docLoader as documentLoader } from "../__fixtures__/document";
import {
  jwkKeyTest,
  simple,
  simpleSigned,
  complex,
  complexSigned,
} from "../__fixtures__/context-test";

const issueCredential = async (template: any) => {
  const key = await Ed25519KeyPair.from(jwkKeyTest);
  const jwk = await key.export({
    privateKey: true,
    type: "Ed25519VerificationKey2018",
  });

  const verificationKey = await Ed25519VerificationKey2018.from(jwk);
  const suite = new Ed25519Signature2018({
    key: verificationKey,
    date: "1991-08-25T12:33:56Z",
  });

  const proof = await suite.createProof({
    document: template,
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
    compactProof: false,
  });

  const signed = { proof, ...template };
  return signed;
};

describe("issuing credentials with context", () => {
  it("should issue simple ", async () => {
    const signed = await issueCredential(simple);
    expect(signed).toEqual(simpleSigned);
  });

  it("should issue complex ", async () => {
    const signed = await issueCredential(complex);
    expect(signed).toEqual(complexSigned);
  });
});
