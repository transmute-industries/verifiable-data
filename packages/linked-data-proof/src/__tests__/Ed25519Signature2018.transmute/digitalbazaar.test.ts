import { Ed25519VerificationKey2018 } from "@digitalbazaar/ed25519-verification-key-2018";
import { Ed25519Signature2018 } from "@digitalbazaar/ed25519-signature-2018";

import * as fixtures from "./__fixtures__";
import * as jsigs from "../..";

let key: any;
let suite: any;

const purpose = new jsigs.purposes.AssertionProofPurpose();

// transmute can use digital bazaar suite
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
      documentLoader: (iri: string) => {
        //  digital bazaar expects the document loader to dereference
        if (iri === key.id) {
          return {
            documentUrl: iri,
            document: {
              "@context": fixtures.docSigned["@context"],
              ...fixtures.key
            }
          };
        }
        return fixtures.documentLoader(iri);
      }
    }
  );
  //   console.log(JSON.stringify(res, null, 2));
  expect(res.verified).toBe(true);
});
