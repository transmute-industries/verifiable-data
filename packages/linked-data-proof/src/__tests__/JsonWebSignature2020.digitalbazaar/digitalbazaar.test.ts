import { JsonWebKey, JsonWebSignature } from "@transmute/json-web-signature";

import * as fixtures from "./__fixtures__";
import jsigs from "jsonld-signatures";

let key: JsonWebKey;
let suite: JsonWebSignature;

const purpose = new jsigs.purposes.AssertionProofPurpose();

beforeAll(async () => {
  key = await JsonWebKey.from(fixtures.key as any);
  suite = new JsonWebSignature({
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
  // console.log(JSON.stringify(docSigned));
  expect(docSigned).toEqual(fixtures.docSigned);
});

it("verify", async () => {
  const res = await jsigs.verify(
    { ...fixtures.docSigned },
    {
      suite: new JsonWebSignature(),
      purpose: purpose,
      documentLoader: fixtures.documentLoader
    }
  );
  // console.log(JSON.stringify(res));
  expect(res.verified).toBe(true);
});
