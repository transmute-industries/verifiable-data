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

it("issue", async () => {
  const jwt = await vc.createVerifiableCredential(
    { ...fixtures.credential, issuer: { id: key.controller } },
    {
      signer,
      documentLoader: fixtures.documentLoader
    }
  );
  expect(jwt).toBe(fixtures.verifiableCredential);
});

it("verify", async () => {
  const verified = await vc.verifyVerifiableCredential(
    fixtures.verifiableCredential,
    {
      verifier,
      documentLoader: fixtures.documentLoader
    }
  );
  expect(verified).toBe(true);
});

it("present", async () => {
  const jwt = await vc.createVerifiablePresentation(
    { ...fixtures.presentation, holder: { id: key.controller } },
    {
      domain: "example.com",
      challenge: "123",
      signer,
      documentLoader: fixtures.documentLoader
    }
  );
  expect(jwt).toBe(fixtures.verifiablePresentation);
});

it("verify", async () => {
  const verified = await vc.verifyVerifiablePresentation(
    fixtures.verifiablePresentation,
    {
      domain: "example.com",
      challenge: "123",
      verifier,
      documentLoader: fixtures.documentLoader
    }
  );
  expect(verified).toBe(true);
});
