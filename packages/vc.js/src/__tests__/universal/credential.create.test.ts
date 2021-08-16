import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020
} from "@transmute/json-web-signature";
import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020
} from "@transmute/bbs-bls12381-signature-2020";

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

it("can create zkp credentials", async () => {
  const result = await verifiable.credential.create({
    credential: {
      ...fixtures.credential1,
      issuer: { id: fixtures.key1.controller } // make sure issuer is set correctly
    },
    format: ["vc"],
    documentLoader: fixtures.documentLoader,
    suite: new BbsBlsSignature2020({
      key: await Bls12381G2KeyPair.from(fixtures.key1 as any),
      date: fixtures.credential1.issuanceDate // make signature stable
    }) as any
  });
  expect(result.items[0].proof.type).toBe("BbsBlsSignature2020");
});
