import { JsonWebKey, JsonWebSignature } from "@transmute/json-web-signature";
import { ld as vc } from "../../..";

import * as fixtures from "./__fixtures__";

let key: JsonWebKey;
let suite: JsonWebSignature;

// our lib, our suite.
beforeAll(async () => {
  key = await JsonWebKey.from(fixtures.key as any);
  suite = new JsonWebSignature({
    key,
    date: "2010-01-01T19:23:24Z"
  });
});

it("verify unisigned presentation", async () => {
  const res = await vc.verifyVerifiablePresentation({
    presentation: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [fixtures.verifiableCredential]
    },
    suite,
    strict: "ignore",
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(true);
});

it("should throw when unisigned presentation", async () => {
  expect.assertions(1);
  try {
    await vc.verifyVerifiablePresentation({
      presentation: {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        type: ["VerifiablePresentation"],
        verifiableCredential: [fixtures.verifiableCredential]
      },
      suite,
      strict: "throw",
      documentLoader: fixtures.documentLoader
    });
  } catch (e) {
    expect(e.message).toBe('presentation MUST contain "proof" when strict');
  }
});

it("should throw when unisigned presentation and no credentials", async () => {
  expect.assertions(1);
  try {
    await vc.verifyVerifiablePresentation({
      presentation: {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        type: ["VerifiablePresentation"]
      },
      suite,
      strict: "throw",
      documentLoader: fixtures.documentLoader
    });
  } catch (e) {
    expect(e.message).toBe(
      'presentation MUST contain "proof" or "verifiableCredential"'
    );
  }
});

it("should fail when credentials are invalid json ld", async () => {
  const res = await vc.verifyVerifiablePresentation({
    presentation: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [
        {
          ...fixtures.verifiableCredential,
          issuer2: "did:example:123"
        }
      ]
    },
    suite,
    strict: "throw",
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(false);
});

it("should fail when credentials are tampered credentials", async () => {
  const res = await vc.verifyVerifiablePresentation({
    presentation: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [
        {
          ...fixtures.verifiableCredential,
          issuer: "did:example:123"
        }
      ]
    },
    suite,
    strict: "ignore",
    documentLoader: fixtures.documentLoader
  });
  expect(res.verified).toBe(false);
});
