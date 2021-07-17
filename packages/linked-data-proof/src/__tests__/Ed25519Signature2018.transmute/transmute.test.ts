import {
  Ed25519VerificationKey2018,
  Ed25519Signature2018
} from "@transmute/ed25519-signature-2018";

import * as fixtures from "./__fixtures__";
import * as jsigs from "../..";

let key: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;

const purpose = new jsigs.purposes.AssertionProofPurpose();

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
  const res = await jsigs.verify(
    { ...fixtures.docSigned },
    {
      suite: new Ed25519Signature2018(),
      purpose: purpose,
      documentLoader: fixtures.documentLoader
    }
  );
  // console.log(JSON.stringify(res));
  expect(res.verified).toBe(true);
});
