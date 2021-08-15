import * as fixtures from "./__fixtures__";
import { Ed25519KeyPair } from "@transmute/ed25519-key-pair";
import { JWS } from "@transmute/jose-ld";
import { jwt as vc } from "../../..";

let key: Ed25519KeyPair;
let signer: any;
let verifier: any;

beforeAll(async () => {
  key = await Ed25519KeyPair.from(fixtures.key as any);
  const [rawSuiteType, JWA_ALG]: any = ["EdDsa", "EdDSA"];
  signer = JWS.createSigner(key.signer(rawSuiteType), JWA_ALG, {
    header: { kid: key.id }
  });
  verifier = JWS.createVerifier(key.verifier(rawSuiteType), JWA_ALG);
});

it("should fail to present without nonce", async () => {
  expect.assertions(1);
  try {
    await vc.createVerifiablePresentation(
      { ...fixtures.presentation, holder: { id: key.controller } },
      {
        signer,
        documentLoader: fixtures.documentLoader
      } as any
    );
  } catch (e) {
    expect(e.message).toBe(
      '"challenge" is required to create verifiable presentations (it will be used for the "nonce" value)'
    );
  }
});

it("should fail to verify when nonce does not match", async () => {
  const jwt = await vc.createVerifiablePresentation(
    { ...fixtures.presentation, holder: { id: key.controller } },
    {
      challenge: "123",
      signer,
      documentLoader: fixtures.documentLoader
    }
  );
  expect.assertions(1);
  try {
    await vc.verifyVerifiablePresentation(jwt, {
      challenge: "456",
      verifier,
      documentLoader: fixtures.documentLoader
    });
  } catch (e) {
    expect(e.message).toBe(
      '"nonce" and "challenge" does not match this verifiable presentation'
    );
  }
});
