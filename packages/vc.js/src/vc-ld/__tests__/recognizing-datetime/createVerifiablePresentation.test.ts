import { JsonWebKey, JsonWebSignature } from "@transmute/json-web-signature";
import { ld as vc } from "../../..";

import * as fixtures from "./__fixtures__";

let key: JsonWebKey;
let suite: JsonWebSignature;

// our lib, our suite.
beforeAll(async () => {
  key = await JsonWebKey.from(fixtures.key as any);
  suite = new JsonWebSignature({
    key,
    date: "2010-01-01T19:23:24Z"
  });
});

it("w3c datetime is supported", async () => {
  const docSigned = await vc.createVerifiablePresentation({
    presentation: {
      "@context": fixtures.credential["@context"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [
        await vc.createVerifiableCredential({
          credential: {
            ...fixtures.credential,
            issuer: { id: key.controller }
          },
          suite,
          documentLoader: fixtures.documentLoader,
          strict: "throw"
        })
      ]
    },
    challenge: "123",
    suite,
    strict: "throw",
    documentLoader: fixtures.documentLoader // required since custom suite.
  });
  expect(docSigned).toEqual(fixtures.verifiablePresentation);
});

it("should throw when RFC 3339 and ISO 8601 do not agree.", async () => {
  expect.assertions(1);
  try {
    await vc.createVerifiablePresentation({
      presentation: {
        "@context": fixtures.credential["@context"],
        type: ["VerifiablePresentation"],
        verifiableCredential: [
          await vc.createVerifiableCredential({
            credential: {
              ...fixtures.credential,
              issuer: { id: key.controller },
              issuanceDate: "1985-04-12 23:20:50.52Z"
            },
            suite,
            documentLoader: fixtures.documentLoader,
            strict: "ignore"
          })
        ]
      },
      challenge: "123",
      suite,
      strict: "throw",
      documentLoader: fixtures.documentLoader // required since custom suite.
    });
  } catch (e) {
    expect((e as Error).message).toBe(`issuanceDate is not valid: [
  "1985-04-12 23:20:50.52Z is not a legal ISO 8601 Date Time.",
  "1985-04-12 23:20:50.52Z is not a XMLSCHEMA11-2 date-time. See: https://www.w3.org/TR/vc-data-model/#issuance-date, https://www.w3.org/TR/xmlschema11-2/#dateTime"
]
issuanceDate must be XML Datestring as defined in spec: https://w3c.github.io/vc-data-model/#issuance-date`);
  }
});
