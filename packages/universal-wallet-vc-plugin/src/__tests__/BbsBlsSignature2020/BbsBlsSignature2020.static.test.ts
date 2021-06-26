import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020
} from "@mattrglobal/jsonld-signatures-bbs";

import { plugin } from "../../index";

import {
  key0,
  credential,
  documentLoader,
  verifiableCredential,
  verifiablePresentation,
  controller
} from "./__fixtures__";

let key: Bls12381G2KeyPair;
let suite: BbsBlsSignature2020;

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

beforeAll(async () => {
  key = await Bls12381G2KeyPair.from(key0 as any);
  suite = new BbsBlsSignature2020({
    key,
    date: "2021-06-19T18:53:11Z"
  });
});

describe("from / issue / present / verify", () => {
  it("issue", async () => {
    const vc = await plugin.issue({
      credential: { ...credential, issuer: key.controller },
      options: {
        suite,
        documentLoader
      }
    });
    expectProofsToBeEqual(vc, verifiableCredential);
  });
  it("present", async () => {
    const vp = await plugin.createVerifiablePresentation({
      presentation: {
        // note that this is required because BBS+ is not in credentials/v1
        "@context": credential["@context"],
        type: ["VerifiablePresentation"],
        holder: key.controller,
        verifiableCredential
      },
      options: {
        challenge: "nonce-123",
        domain: "example.com",
        suite,
        documentLoader
      }
    });

    expectProofsToBeEqual(vp, verifiablePresentation);
  });

  it("verify", async () => {
    const verification = await plugin.verifyPresentation({
      presentation: verifiablePresentation,
      options: {
        challenge: "nonce-123",
        domain: "example.com",
        suite,
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
    expect(verification.verified).toBe(true);
  });
});
