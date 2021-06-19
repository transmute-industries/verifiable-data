import {
  documentLoader,
  credential,
  verifiableCredential,
} from "../__fixtures__";
import * as vcjs from "@transmute/vc.js";
import { Ed25519Signature2018, EdDsaEd25519KeyPair } from "..";

const customDocumentLoader = (iri: string) => {
  if (
    iri.startsWith("did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT")
  ) {
    return {
      documentUrl: iri,
      document: {
        "@context": [
          "https://www.w3.org/ns/did/v1",
          "https://w3id.org/security/suites/jws-2020/v1",
        ],
        id: "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
        verificationMethod: [
          {
            id:
              "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT#z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
            type: "JsonWebKey2020",
            controller:
              "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
            publicKeyJwk: {
              crv: "Ed25519",
              x: "kYUxJdxcqoKbfJKjTPEmbifNrDBvuQuoGynhwmr4BSA",
              kty: "OKP",
            },
          },
          {
            id:
              "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT#z6LSqzEVoTwYxvHy3gp2SrKZ7s1duWmyXS1khvEXQyWAS5iS",
            type: "JsonWebKey2020",
            controller:
              "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
            publicKeyJwk: {
              kty: "OKP",
              crv: "X25519",
              x: "1KPW5_QTVSFbveTXCeiJ1zescdEApIywCQt-5Bl4uAs",
            },
          },
        ],
        authentication: [
          "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT#z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
        ],
        assertionMethod: [
          "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT#z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
        ],
        capabilityInvocation: [
          "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT#z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
        ],
        capabilityDelegation: [
          "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT#z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
        ],
        keyAgreement: [
          "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT#z6LSqzEVoTwYxvHy3gp2SrKZ7s1duWmyXS1khvEXQyWAS5iS",
        ],
      },
    };
  }
  return documentLoader(iri);
};

it("can generate, issue, prove and verify", async () => {
  const key = await EdDsaEd25519KeyPair.from({
    id:
      "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT#z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
    type: "JsonWebKey2020",
    controller: "did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT",
    publicKeyJwk: {
      kty: "OKP",
      crv: "Ed25519",
      x: "kYUxJdxcqoKbfJKjTPEmbifNrDBvuQuoGynhwmr4BSA",
    },
    privateKeyJwk: {
      kty: "OKP",
      crv: "Ed25519",
      x: "kYUxJdxcqoKbfJKjTPEmbifNrDBvuQuoGynhwmr4BSA",
      d:
        "TmG8GRjqakeuMwczG-d5gZahqOfP5Lbo98ml82AX2SmRhTEl3Fyqgpt8kqNM8SZuJ82sMG-5C6gbKeHCavgFIA",
    },
  });

  const vc = await vcjs.ld.issue({
    credential,
    suite: new Ed25519Signature2018({
      date: "2021-06-19T18:53:11Z",
      key,
    }),
    documentLoader: customDocumentLoader,
  });
  expect(vc).toEqual(verifiableCredential);

  const vp = await vcjs.ld.signPresentation({
    presentation: await vcjs.ld.createPresentation({
      verifiableCredential: vc,
      holder: key.controller,
      documentLoader: customDocumentLoader,
    }),
    challenge: "123",
    suite: new Ed25519Signature2018({
      key,
    }),
    documentLoader: customDocumentLoader,
  });

  const presentation = await vcjs.ld.verify({
    presentation: vp,
    challenge: "123",
    suite: new Ed25519Signature2018(),
    documentLoader: customDocumentLoader,
  });

  expect(presentation.verified).toBe(true);
});
