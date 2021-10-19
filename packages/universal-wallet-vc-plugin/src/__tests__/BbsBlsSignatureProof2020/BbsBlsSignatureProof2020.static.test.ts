import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof
} from "@mattrglobal/jsonld-signatures-bbs";

import { plugin } from "../../index";

import {
  key0,
  documentLoader,
  verifiableCredential,
  frame,
  controller,
  derivedCredential,
  verifiablePresentation
} from "./__fixtures__";

let key: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;

beforeAll(async () => {
  key = await Bls12381G2KeyPair.from(key0 as any);
  suite = new BbsBlsSignature2020({
    key,
    date: "2021-06-19T18:53:11Z"
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

describe("from / derive / present / verify", () => {
  it("derive", async () => {
    const vc = await plugin.deriveCredential({
      verifiableCredential: { ...verifiableCredential },
      frame,
      options: {
        suite: new BbsBlsSignatureProof2020(),
        deriveProof,
        documentLoader: (iri: string) => {
          if (iri.startsWith(controller.id)) {
            return {
              document: controller
            };
          }
          return documentLoader(iri);
        }
      }
    });
    expectProofsToBeEqual(vc, derivedCredential);
  });

  it("present", async () => {
    const vp = await plugin.createVerifiablePresentation({
      presentation: {
        // note that this is required because BBS+ is not in credentials/v1
        "@context": verifiableCredential["@context"],
        type: ["VerifiablePresentation"],
        holder: key.controller,
        verifiableCredential: [derivedCredential]
      },
      options: {
        challenge: "nonce-123",
        domain: "example.com",
        suite,
        documentLoader,
        format: ["vp"]
      }
    });
    expectProofsToBeEqual(vp, verifiablePresentation);
  });

  it.skip("verify", async () => {
    const verification = await plugin.verifyPresentation({
      presentation: verifiablePresentation,
      options: {
        challenge: "nonce-123",
        domain: "example.com",
        // suiteMap: {
        //   BbsBlsSignature2020,
        //   BbsBlsSignatureProof2020,
        // },
        suite: new BbsBlsSignatureProof2020(),
        documentLoader: (iri: string) => {
          if (iri.startsWith(controller.id)) {
            return {
              document: controller
            };
          }
          return documentLoader(iri);
        },
        format: ["vp"]
      }
    });
    console.log(JSON.stringify(verification, null, 2));
    expect(verification.verified).toBe(true);
  });
});
