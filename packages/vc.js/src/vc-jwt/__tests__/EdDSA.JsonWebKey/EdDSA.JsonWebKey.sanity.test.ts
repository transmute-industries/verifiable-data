import * as fixtures from "./__fixtures__";
import { Ed25519KeyPair } from "@transmute/ed25519-key-pair";
import { JsonWebKey } from "@transmute/json-web-signature";
import { JWS } from "@transmute/jose-ld";

let key: Ed25519KeyPair;
let key2: JsonWebKey;
const [rawSuiteType, JWA_ALG]: any = ["EdDsa", "EdDSA"];
let credential: any;
let payload: any;

beforeAll(async () => {
  key = await Ed25519KeyPair.from(fixtures.key as any);
  // Note that signer configuration when the key is instantiated.
  key2 = await JsonWebKey.from(fixtures.key as any, {
    detached: false,
    header: {
      kid: "123"
    }
  });
  credential = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: "http://example.edu/credentials/3732",
    type: ["VerifiableCredential"],
    issuer: key.controller,
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      id: "did:example:123"
    }
  };
  payload = {
    iss: credential.issuer,
    sub: credential.credentialSubject.id,
    vc: credential,
    jti: credential.id,
    nbf: 1262373804
  };
});

it("sign / verify", async () => {
  const signer = JWS.createSigner(key.signer(rawSuiteType), JWA_ALG, {
    header: {
      kid: "123"
    }
  });
  const verifier = JWS.createVerifier(key.verifier(rawSuiteType), JWA_ALG);
  const signatureFromEd25519KeyPair = await signer.sign({ data: payload });
  const verified = await verifier.verify({
    signature: signatureFromEd25519KeyPair
  });
  expect(verified).toBe(true);
  // Note that JSON Web Key signer's already produce JWS.
  const signer2 = key2.signer();
  const signatureFromJsonWebKey = await signer2.sign({ data: payload });
  expect(signatureFromJsonWebKey).toBe(signatureFromEd25519KeyPair);
  const verifier2 = key2.verifier();
  const verified2 = await verifier2.verify({
    signature: signatureFromJsonWebKey
  });
  expect(verified2).toBe(true);
});
