import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020
} from "@transmute/json-web-signature";

import { verifiable } from "../..";
import * as fixtures from "../universal/__fixtures__";

describe("VC Data Model", () => {
  let vcLd: any;
  let vcJwt: any;

  const credentialWithoutProof = {
    ...fixtures.credential,
    "@context": [
      ...fixtures.credential["@context"],
      { "@vocab": "https://example.com/vocab/#" }
    ],
    issuer: {
      id: fixtures.key.controller,
      name: "Example Corp.",
      website: "https://example.com"
    }
  };

  beforeAll(async () => {
    const { items } = await verifiable.credential.create({
      credential: credentialWithoutProof,
      format: ["vc", "vc-jwt"],
      documentLoader: fixtures.documentLoader,
      suite: new JsonWebSignature({
        key: await JsonWebKey.from(fixtures.key as JsonWebKey2020),
        date: credentialWithoutProof.issuanceDate // make signature stable
      })
    });

    [vcLd, vcJwt] = items;

    vcJwt = verifiable.jwt.decode(vcJwt);
  });
  describe("issuer", () => {
    it("all fields are preserved by LD Proof based VCs", async () => {
      expect(vcLd.issuer).toEqual(credentialWithoutProof.issuer);
    });
    it("all fields are preserved by JWT based VCs", () => {
      expect(vcJwt.payload.vc.issuer).toEqual(credentialWithoutProof.issuer);
    });
  });

  describe("credentialSubject", () => {
    it("all fields are preserved by LD Proof based VCs", async () => {
      expect(vcLd.credentialSubject).toEqual(
        credentialWithoutProof.credentialSubject
      );
    });
    it("all fields are preserved by JWT based VCs", () => {
      expect(vcJwt.payload.vc.credentialSubject).toEqual(
        credentialWithoutProof.credentialSubject
      );
    });
  });
});
