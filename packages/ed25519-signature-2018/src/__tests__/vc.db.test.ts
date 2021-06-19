import { documentLoader, credential } from "../__fixtures__";

import { Ed25519Signature2018, EdDsaEd25519KeyPair } from "..";

const vcjs = require("vc-js");

it("can generate, issue, prove and verify", async () => {
  const key = await EdDsaEd25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        "4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929",
        "hex"
      );
    },
  });

  const vc = await vcjs.issue({
    credential,
    suite: new Ed25519Signature2018({
      key,
    }),
    documentLoader,
  });
  const vp = await vcjs.signPresentation({
    presentation: await vcjs.createPresentation({
      verifiableCredential: vc,
      holder: key.controller,
      documentLoader,
    }),
    challenge: "123",
    suite: new Ed25519Signature2018({
      key,
    }),
    documentLoader,
  });
  const presentation = await vcjs.verify({
    presentation: vp,
    challenge: "123",
    suite: new Ed25519Signature2018(),
    documentLoader,
  });
  // console.log(JSON.stringify(presentation, null, 2));
  expect(presentation.verified).toBe(true);
});
