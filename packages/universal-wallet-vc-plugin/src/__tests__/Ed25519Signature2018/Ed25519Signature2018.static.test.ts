import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";
import * as ed25519 from "@transmute/did-key-ed25519";

import { plugin } from "../../index";

import {
  key0,
  credential,
  documentLoader,
  verifiableCredential,
  verifiablePresentation,
  controller
} from "./__fixtures__";

let key: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;

beforeAll(async () => {
  key = await Ed25519VerificationKey2018.from(key0);
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
        documentLoader: async (iri: string) => {
          if (iri.startsWith(controller.id)) {
            const { didDocument } = await ed25519.resolve(controller.id);
            return {
              document: didDocument
            };
          }
          return documentLoader(iri);
        }
      }
    });
    expect(verification.verified).toBe(true);
  });
});