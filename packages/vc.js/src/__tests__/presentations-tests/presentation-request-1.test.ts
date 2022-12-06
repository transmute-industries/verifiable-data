import { verifiable } from "../../index";

import fixture from "./__fixtures__/request-1.json";

import { Ed25519Signature2018 } from "@transmute/ed25519-signature-2018";
import documentLoader from "../../__fixtures__/documentLoader";
import checkStatus from "./__fixtures__/checkStatus";

describe("presentations of revocable credentials", () => {
  it("should verify presentations of revocable", async () => {
    const suite = new Ed25519Signature2018();
    const res = await verifiable.presentation.verify({
      presentation: fixture.verifiablePresentation,
      challenge: fixture.options.challenge,
      suite,
      // Not including vc-status-rl-2020 because of cyclical reference since it references vc.js
      checkStatus,
      documentLoader
    });
    expect(res.verified).toBe(true);
    expect(res.presentation.verified).toBe(true);
    expect(res.credentials.verified).toBe(true);
  });

  it("should fail to verify which no checkStatus is provided", async () => {
    expect.assertions(1);
    try {
      const suite = new Ed25519Signature2018();
      await verifiable.presentation.verify({
        presentation: fixture.verifiablePresentation,
        challenge: fixture.options.challenge,
        suite,
        documentLoader
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        "options.checkStatus is required to verify presentation of revocable credentials."
      );
    }
  });
});
