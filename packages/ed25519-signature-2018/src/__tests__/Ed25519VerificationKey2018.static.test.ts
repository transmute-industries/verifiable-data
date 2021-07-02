import {
  documentLoader,
  rawKeyJsonLd,
  credential,
  verifiableCredential
} from "../__fixtures__";
import * as vcjs from "@transmute/vc.js";
import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";

it("can from, issue, prove and verify", async () => {
  const key = await Ed25519VerificationKey2018.from(rawKeyJsonLd);

  const customDocumentLoader = (iri: string) => {
    if (iri.startsWith(rawKeyJsonLd.controller)) {
      return {
        documentUrl: iri,
        document: {
          "@context": [
            "https://www.w3.org/ns/did/v1",
            "https://w3id.org/security/suites/ed25519-2018/v1"
          ],
          id: rawKeyJsonLd.controller,
          verificationMethod: [rawKeyJsonLd],
          authentication: [rawKeyJsonLd.id],
          assertionMethod: [rawKeyJsonLd.id]
        }
      };
    }
    return documentLoader(iri);
  };

  const vc = await vcjs.ld.issue({
    credential: {
      ...credential
    },
    suite: new Ed25519Signature2018({
      date: "2021-06-19T18:53:11Z",
      key
    }),
    documentLoader: customDocumentLoader
  });

  expect(vc).toEqual(verifiableCredential);

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
