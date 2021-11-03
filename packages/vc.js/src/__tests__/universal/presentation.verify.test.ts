import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020
} from "@transmute/json-web-signature";

import { verifiable } from "../..";
import * as fixtures from "./__fixtures__";

fixtures.presentationCreate.items.forEach(vp => {
  describe(JSON.stringify(vp).substring(0, 15) + "...", () => {
    it("can verify presentations", async () => {
      const result = await verifiable.presentation.verify({
        presentation: vp,
        format: ["vp", "vp-jwt"],
        documentLoader: fixtures.documentLoader,
        challenge: "123", // this is supplied by the verifier / presentation recipient
        suite: new JsonWebSignature({
          key: await JsonWebKey.from(fixtures.key as JsonWebKey2020),
          date: fixtures.credential.issuanceDate // make signature stable
        })
      });
      expect(result.verified).toBe(true);
    });
  });
});
