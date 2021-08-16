import { JsonWebSignature } from "@transmute/json-web-signature";

import { verifiable } from "../..";
import * as fixtures from "./__fixtures__";

fixtures.credentialCreate.items.forEach(vc => {
  it("can verify credentials", async () => {
    const result = await verifiable.credential.verify({
      credential: vc,
      format: ["vc", "vc-jwt"],
      documentLoader: fixtures.documentLoader,
      suite: [new JsonWebSignature()]
    });
    expect(result.verified).toBe(true);
  });
});
