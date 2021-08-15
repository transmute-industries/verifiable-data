import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020
} from "@transmute/json-web-signature";

import { verifiable } from "../..";
import * as fixtures from "./__fixtures__";

it("can create presentations", async () => {
  const result = await verifiable.presentation.create({
    presentation: {
      ...fixtures.presentation,
      holder: { id: fixtures.key.controller } // make sure holder is set correctly
    },
    format: ["vp", "vp-jwt"],
    documentLoader: fixtures.documentLoader,
    challenge: "123", // this is supplied by the verifier / presentation recipient
    suite: new JsonWebSignature({
      key: await JsonWebKey.from(fixtures.key as JsonWebKey2020),
      date: fixtures.credential.issuanceDate // make signature stable
    })
  });
  expect(result).toEqual(fixtures.presentationCreate);
});
