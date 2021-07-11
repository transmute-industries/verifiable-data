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
    header: { kid: key.id },
  });
  verifier = JWS.createVerifier(key.verifier(rawSuiteType), JWA_ALG);
});

it("sign / verify", async () => {
  const jwt = await vc.createVerifiableCredential(
    { message: "hello" },
    signer,
    fixtures.documentLoader
  );
  const verified = await vc.verifyVerifiableCredential(
    jwt,
    verifier,
    fixtures.documentLoader
  );
  console.log(jwt, verified);
});

it("issue", async () => {
  const jwt = await vc.createVerifiableCredential(
    fixtures.credential,
    signer,
    fixtures.documentLoader
  );
  expect(jwt).toBe(fixtures.jwt);
});

it("verify", async () => {
  console.log(fixtures.jwt);
  const verified = await vc.verifyVerifiableCredential(
    fixtures.jwt,
    verifier,
    fixtures.documentLoader
  );

  expect(verified).toBe(true);
});
