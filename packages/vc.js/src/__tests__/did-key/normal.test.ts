import * as fixtures from "./__fixtures__";
import { verifiable } from "../../";
import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020
} from "@transmute/json-web-signature";

fixtures.registeredKeys.forEach(k => {
  describe(`${k.publicKeyJwk.kty} ${k.publicKeyJwk.crv}`, () => {
    describe("credentials", () => {
      ["vc", "vc-jwt"].forEach((format: any) => {
        describe(format, () => {
          let credential: any;
          it("can create credential", async () => {
            const result = await verifiable.credential.create({
              credential: {
                ...fixtures.credential,
                issuer: { id: k.controller } // make sure issuer is set correctly
              },
              format: [format],
              documentLoader: fixtures.documentLoader,
              suite: new JsonWebSignature({
                key: await JsonWebKey.from(k as JsonWebKey2020),
                date: fixtures.credential.issuanceDate // make signature stable
              })
            });
            [credential] = result.items;
          });
          it("can verify credential", async () => {
            const result = await verifiable.credential.verify({
              credential: credential,
              format: [format],
              documentLoader: fixtures.documentLoader,
              suite: new JsonWebSignature({
                key: await JsonWebKey.from(k as JsonWebKey2020),
                date: fixtures.credential.issuanceDate // make signature stable
              })
            });
            expect(result.verified).toBe(true);
          });
        });
      });
    });

    describe("presentations", () => {
      ["vp", "vp-jwt"].forEach((format: any) => {
        describe(format, () => {
          let presentation: any;
          it("can create presentation", async () => {
            const result = await verifiable.presentation.create({
              presentation: {
                ...fixtures.presentation,
                holder: { id: k.controller } // make sure holder is set correctly
              },
              format: [format],
              challenge: "123",
              documentLoader: fixtures.documentLoader,
              suite: new JsonWebSignature({
                key: await JsonWebKey.from(k as JsonWebKey2020),
                date: fixtures.credential.issuanceDate // make signature stable
              })
            });
            [presentation] = result.items;
          });
          it("can verify presentation", async () => {
            const result = await verifiable.presentation.verify({
              presentation: presentation,
              format: [format],
              challenge: "123",
              documentLoader: fixtures.documentLoader,
              suite: new JsonWebSignature({
                key: await JsonWebKey.from(k as JsonWebKey2020),
                date: fixtures.credential.issuanceDate // make signature stable
              })
            });
            expect(result.verified).toBe(true);
          });
        });
      });
    });
  });
});
