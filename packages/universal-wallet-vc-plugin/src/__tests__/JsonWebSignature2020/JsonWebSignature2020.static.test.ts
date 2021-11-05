import { JsonWebSignature, JsonWebKey } from "@transmute/json-web-signature";

import { plugin } from "../../index";

import {
  key0,
  credential,
  documentLoader,
  verifiableCredential,
  verifiablePresentation,
  controller
} from "./__fixtures__";

let key: JsonWebKey;
let suite: JsonWebSignature;

beforeAll(async () => {
  key = await JsonWebKey.from(key0 as any);
  suite = new JsonWebSignature({
    key,
    date: "2021-06-19T18:53:11Z"
  });
});

describe("from / issue / present / verify", () => {
  it.skip("issue", async () => {
    const vc = await plugin.issue({
      credential: { ...credential, issuer: key.controller },
      options: {
        suite,
        documentLoader
      }
    });
    expect(vc).toEqual(verifiableCredential);
  });
  it.skip("present", async () => {
    const vp = await plugin.createVerifiablePresentation({
      presentation: {
        // note that this is required because BBS+ is not in credentials/v1
        "@context": verifiableCredential["@context"],
        type: ["VerifiablePresentation"],
        holder: key.controller,
        verifiableCredential: [verifiableCredential]
      },
      options: {
        challenge: "nonce-123",
        domain: "example.com",
        suite,
        documentLoader
      }
    });
    expect(vp).toEqual(verifiablePresentation);
  });

  it.skip("verify", async () => {
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
