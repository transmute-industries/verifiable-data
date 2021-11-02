import { verifiable } from "../../index";

import fixture from "./__fixtures__/request-0.json";

import { Ed25519Signature2018 } from "@transmute/ed25519-signature-2018";
import documentLoader from "../../__fixtures__/documentLoader";

describe("verify presentation request 0", () => {
  it("should verify", async () => {
    const suite = new Ed25519Signature2018();
    const res = await verifiable.presentation.verify({
      presentation: fixture.verifiablePresentation,
      domain: fixture.options.domain,
      challenge: fixture.options.challenge,
      suite,
      documentLoader
    });
    expect(res.verified).toBe(true);
    expect(res.presentation.verified).toBe(true);
    expect(res.credentials.verified).toBe(true);
  });
  it("should fail when domain is changed", async () => {
    const suite = new Ed25519Signature2018();
    const res = await verifiable.presentation.verify({
      presentation: fixture.verifiablePresentation,
      domain: fixture.options.domain + "foo",
      challenge: fixture.options.challenge,
      suite,
      documentLoader
    });
    expect(res.verified).toBe(false);
    expect(res.presentation.verified).toBe(false);
    expect(res.credentials.verified).toBe(true);
  });

  it("should fail when challenge is changed", async () => {
    const suite = new Ed25519Signature2018();
    const res = await verifiable.presentation.verify({
      presentation: fixture.verifiablePresentation,
      domain: fixture.options.domain,
      challenge: fixture.options.challenge + "foo",
      suite,
      documentLoader
    });
    expect(res.verified).toBe(false);
    expect(res.presentation.verified).toBe(false);
    expect(res.credentials.verified).toBe(true);
  });

  it("should fail when credential is changed", async () => {
    const suite = new Ed25519Signature2018();
    const tampered = JSON.parse(JSON.stringify(fixture.verifiablePresentation));
    tampered["verifiableCredential"][0].id = "urn:uuid:123";
    const res = await verifiable.presentation.verify({
      presentation: tampered,
      domain: fixture.options.domain,
      challenge: fixture.options.challenge,
      suite,
      documentLoader
    });
    expect(res.verified).toBe(false);
    expect(res.presentation.verified).toBe(false);
    expect(res.credentials.verified).toBe(false);
  });
});
