import { documentLoader, credential, rawKeyJsonLd } from "../__fixtures__";
import * as vcjs from "@transmute/vc.js";
import { Ed25519Signature2018, EdDsaEd25519KeyPair } from "..";

it("can generate, issue, prove and verify", async () => {
  const key = await EdDsaEd25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        "4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578",
        "hex"
      );
    }
  });

  const rawKeyJson = await key.export({ type: "JsonWebKey2020" });

  const rawKeyJsonLdConverted = await key.export({
    type: "Ed25519VerificationKey2018",
    privateKey: true
  });
  expect(rawKeyJsonLdConverted).toEqual(rawKeyJsonLd);

  const customDocumentLoader = (iri: string) => {
    if (iri.startsWith(rawKeyJson.controller)) {
      return {
        documentUrl: iri,
        document: {
          "@context": [
            "https://www.w3.org/ns/did/v1",
            "https://w3id.org/security/suites/jws-2020/v1"
          ],
          id: rawKeyJson.controller,
          verificationMethod: [rawKeyJson],
          authentication: [rawKeyJson.id],
          assertionMethod: [rawKeyJson.id]
        }
      };
    }
    return documentLoader(iri);
  };

  const vc = await vcjs.ld.issue({
    credential: {
      ...credential,
      issuer: key.controller
    },
    suite: new Ed25519Signature2018({
      date: "2021-06-19T18:53:11Z",
      key
    }),
    documentLoader: customDocumentLoader
  });

  const vp = await vcjs.ld.signPresentation({
    presentation: await vcjs.ld.createPresentation({
      verifiableCredential: vc,
      holder: key.controller,
      documentLoader: customDocumentLoader
    }),
    challenge: "123",
    suite: new Ed25519Signature2018({
      key
    }),
    documentLoader: customDocumentLoader
  });

  const presentation = await vcjs.ld.verify({
    presentation: vp,
    challenge: "123",
    suite: new Ed25519Signature2018(),
    documentLoader: customDocumentLoader
  });

  expect(presentation.verified).toBe(true);
});
