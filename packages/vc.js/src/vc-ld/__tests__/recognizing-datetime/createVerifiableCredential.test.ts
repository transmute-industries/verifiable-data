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
  const docSigned = await vc.createVerifiableCredential({
    credential: {
      ...fixtures.credential,
      issuer: { id: key.controller }
    },
    suite,
    documentLoader: fixtures.documentLoader,
    strict: "throw"
  });
  expect(docSigned.issuanceDate).toBe("2010-01-01T19:23:24Z");
});

it("should throw when RFC 3339 and ISO 8601 do not agree.", async () => {
  expect.assertions(1);
  try {
    await vc.createVerifiableCredential({
      credential: {
        ...fixtures.credential,
        issuer: { id: key.controller },
        issuanceDate: "1985-04-12 23:20:50.52Z"
      },
      suite,
      documentLoader: fixtures.documentLoader,
      strict: "throw"
    });
  } catch (e) {
    expect((e as Error).message).toBe(`issuanceDate is not valid: [
  "1985-04-12 23:20:50.52Z is not a legal ISO 8601 Date Time.",
  "1985-04-12 23:20:50.52Z is not a XMLSCHEMA11-2 date-time. See: https://www.w3.org/TR/vc-data-model/#issuance-date, https://www.w3.org/TR/xmlschema11-2/#dateTime"
]
issuanceDate must be XML Datestring as defined in spec: https://w3c.github.io/vc-data-model/#issuance-date`);
  }
});

it("should throw when not valid ISO 8601", async () => {
  expect.assertions(1);
  try {
    await vc.createVerifiableCredential({
      credential: {
        ...fixtures.credential,
        issuer: { id: key.controller },
        issuanceDate: "1985-04-12t23:20:50.52Z"
      },
      suite,
      documentLoader: fixtures.documentLoader,
      strict: "throw"
    });
  } catch (e) {
    expect(e.message).toBe(`issuanceDate is not valid: [
  "1985-04-12t23:20:50.52Z is not a legal ISO 8601 Date Time.",
  "1985-04-12t23:20:50.52Z is not a XMLSCHEMA11-2 date-time. See: https://www.w3.org/TR/vc-data-model/#issuance-date, https://www.w3.org/TR/xmlschema11-2/#dateTime"
]
issuanceDate must be XML Datestring as defined in spec: https://w3c.github.io/vc-data-model/#issuance-date`);
  }
});

it("should not throw when not W3C Date Time and not JWT", async () => {
  expect.assertions(0);
  try {
    await vc.createVerifiableCredential({
      credential: {
        ...fixtures.credential,
        issuer: { id: key.controller },
        issuanceDate: "1937-01-01T12:00:27.87+00:20"
      },
      suite,
      documentLoader: fixtures.documentLoader,
      strict: "throw"
    });
  } catch (e) {
    expect(e.message).toBe(`issuanceDate is not valid: [
  "1937-01-01T12:00:27.87+00:20 is not a W3C Date Time.",
  "1937-01-01T12:00:27.87+00:20 could not be converted to unix timestamp and back."
]
issuanceDate must be XML Datestring as defined in spec: https://w3c.github.io/vc-data-model/#issuance-date`);
  }
});
