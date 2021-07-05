import {
  documentLoader,
  rawKeyJson,
  credential,
  verifiableCredential
} from "../__fixtures__";
import * as vcjs from "@transmute/vc.js";
import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";

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

it("can from, issue, prove and verify", async () => {
  const key = await Ed25519VerificationKey2018.from(rawKeyJson);

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
