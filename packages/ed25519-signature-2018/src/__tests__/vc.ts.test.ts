import {
  documentLoader,
  credential,
  verifiableCredential
} from "../__fixtures__";
import * as vcjs from "@transmute/vc.js";
import { Ed25519Signature2018, EdDsaEd25519KeyPair } from "..";

it("can generate, issue, prove and verify", async () => {
  const key = await EdDsaEd25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        "4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929",
        "hex"
      );
    }
  });

  const vc = await vcjs.ld.issue({
    credential,
    suite: new Ed25519Signature2018({
      date: "2021-06-19T18:53:11Z",
      key
    }),
    documentLoader
  });
  expect(vc).toEqual(verifiableCredential);

  const vp = await vcjs.ld.signPresentation({
    presentation: await vcjs.ld.createPresentation({
      verifiableCredential: vc,
      holder: key.controller,
      documentLoader
    }),
    challenge: "123",
    suite: new Ed25519Signature2018({
      key
    }),
    documentLoader
  });

  const presentation = await vcjs.ld.verify({
    presentation: vp,
    challenge: "123",
    suite: new Ed25519Signature2018(),
    documentLoader
  });

  expect(presentation.verified).toBe(true);
});
