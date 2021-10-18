// import { JsonWebKey, JsonWebSignature } from "@transmute/json-web-signature";

import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";
const { verifiable } = require("../../universal/index");
const rawKeyJson = require("./__fixtures__/key.json");
const documentLoader = require("./__fixtures__/documentLoader");

const presentation = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  type: ["VerifiablePresentation"],
  holder: "did:key:z6MkseJscFN8FdoZ9nWj5auotCoEAUvqtYrehdLfzXu8qidp",
  verifiableCredential: [
    {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "https://example.com/credentials/1872",
      type: ["VerifiableCredential"],
      issuer: rawKeyJson.controller,
      issuanceDate: "2010-01-01T19:23:24Z",
      credentialSubject: {
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21"
      }
    }
  ]
};
let key: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;
describe("sign presentation with edd25519 2018 signature", () => {
  beforeAll(async () => {
    key = await Ed25519VerificationKey2018.from(rawKeyJson);
    suite = new Ed25519Signature2018({
      key,
      date: presentation.verifiableCredential[0].issuanceDate
    });
  });
  it("signs and verifies with challenge", async () => {
    const result = await verifiable.presentation.create({
      presentation,
      format: ["vp"],
      documentLoader,
      challenge: "ca978b61-1439-4845-8e29-a89e58200ec1", // this is supplied by the verifier / presentation recipient
      suite
    });
    const result2 = await verifiable.presentation.verify({
      presentation: result.items[0],
      format: ["vp"],
      documentLoader: documentLoader,
      challenge: "ca978b61-1439-4845-8e29-a89e58200ec1", // this is supplied by the verifier / presentation recipient
      suite: new Ed25519Signature2018()
    });
    expect(result2.verified).toBeTruthy();
  });
  it("signs and verifies with domain and challenge", async () => {
    const result = await verifiable.presentation.create({
      presentation,
      format: ["vp"],
      documentLoader,
      challenge: "ca978b61-1439-4845-8e29-a89e58200ec1", // this is supplied by the verifier / presentation recipient
      domain: "supplier",
      suite
    });
    const result2 = await verifiable.presentation.verify({
      presentation: result.items[0],
      format: ["vp"],
      documentLoader: documentLoader,
      challenge: "ca978b61-1439-4845-8e29-a89e58200ec1", // this is supplied by the verifier / presentation recipient
      domain: "supplier",
      suite: new Ed25519Signature2018()
    });
    expect(result2.verified).toBeTruthy();
  });
});
