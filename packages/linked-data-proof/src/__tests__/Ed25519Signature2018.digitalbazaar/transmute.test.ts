import {
  Ed25519VerificationKey2018,
  Ed25519Signature2018
} from "@transmute/ed25519-signature-2018";

import * as fixtures from "./__fixtures__";
import jsigs from "jsonld-signatures";

let key: any;
let suite: any;

const purpose = new jsigs.purposes.AssertionProofPurpose();

// digital bazaar can use transmute suite
beforeAll(async () => {
  key = await Ed25519VerificationKey2018.from(fixtures.key);
  suite = new Ed25519Signature2018({
    key,
    date: "2010-01-01T19:23:24Z"
  });
});

it("sign", async () => {
  const docSigned = await jsigs.sign(
    { ...fixtures.doc, issuer: { id: key.controller } },
    {
      suite,
      purpose,
      documentLoader: fixtures.documentLoader
    }
  );
  expect(docSigned).toEqual(fixtures.docSigned);
});

it("verify", async () => {
  const { verified } = await jsigs.verify(
    { ...fixtures.docSigned },
    {
      suite: [new Ed25519Signature2018()],
      purpose: purpose,
      documentLoader: fixtures.documentLoader
    }
  );
  expect(verified).toBe(true);
});
