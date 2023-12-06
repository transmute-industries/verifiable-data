import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020
} from "@transmute/json-web-signature";

import { verifiable } from "../..";
import * as fixtures from "./__fixtures__";

it("can create credentials", async () => {
  const result = await verifiable.credential.create({
    credential: {
      ...fixtures.credential,
      issuer: { id: fixtures.key.controller } // make sure issuer is set correctly
    },
    format: ["vc", "vc-jwt"],
    documentLoader: fixtures.documentLoader,
    suite: new JsonWebSignature({
      key: await JsonWebKey.from(fixtures.key as JsonWebKey2020),
      date: fixtures.credential.issuanceDate // make signature stable
    })
  });
  expect(result).toEqual(fixtures.credentialCreate);
});
