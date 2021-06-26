import {
  Ed25519Signature2018,
  EdDsaEd25519KeyPair
} from "@transmute/ed25519-signature-2018";

import { plugin } from "../../index";

import {
  key0,
  credential,
  documentLoader,
  verifiableCredential,
  verifiablePresentation,
  controller
} from "./__fixtures__";

let key: EdDsaEd25519KeyPair;
let suite: Ed25519Signature2018;

beforeAll(async () => {
  key = await EdDsaEd25519KeyPair.from(key0);
  suite = new Ed25519Signature2018({
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
    expect(vc).toEqual(verifiableCredential);
  });
  it("present", async () => {
    const vp = await plugin.createVerifiablePresentation({
      verifiableCredential,
      options: {
        challenge: "nonce-123",
        domain: "example.com",
        suite,
        documentLoader
      }
    });
    expect(vp).toEqual(verifiablePresentation);
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
