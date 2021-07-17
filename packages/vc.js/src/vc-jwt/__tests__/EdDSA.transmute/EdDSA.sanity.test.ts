import * as fixtures from "./__fixtures__";
import { Ed25519KeyPair } from "@transmute/ed25519-key-pair";
import { JWS } from "@transmute/jose-ld";

let key: Ed25519KeyPair;

const [rawSuiteType, JWA_ALG]: any = ["EdDsa", "EdDSA"];

beforeAll(async () => {
  key = await Ed25519KeyPair.from(fixtures.key as any);
});

it("sign / verify", async () => {
  const credential: any = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    id: "http://example.edu/credentials/3732",
    type: ["VerifiableCredential"],
    issuer: "https://example.edu/issuers/14",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
      id: "did:example:ebfeb1f712ebc6f1c276e12ec21"
    }
  };
  const payload: any = {
    iss:
      typeof credential.issuer === "string"
        ? credential.issuer
        : credential.issuer.id,
    sub:
      typeof credential.credentialSubject === "string"
        ? credential.credentialSubject
        : credential.credentialSubject.id,
    vc: credential,
    jti: credential.id,
    nbf: 1262373804
  };
  const signer = JWS.createSigner(key.signer(rawSuiteType), JWA_ALG, {
    header: {
      kid: "123"
    }
  });
  const verifier = JWS.createVerifier(key.verifier(rawSuiteType), JWA_ALG);
  const signature = await signer.sign({ data: payload });
  const verified = await verifier.verify({
    signature
  });
  expect(verified).toBe(true);
});
