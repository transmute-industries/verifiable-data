import { Ed25519VerificationKey2018 } from "@transmute/ed25519-key-pair";
import { JsonWebSignature, JsonWebKey } from "@transmute/json-web-signature";
import * as vcjs from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import credential from "../__fixtures__/credentials/case-1.json";
import documentLoader from "../__fixtures__/documentLoader";

let keyPair: any;
let suite: JsonWebSignature;
let verifiableCredential: any;

describe("create and verify verifiable credentials", () => {
  it("import key", async () => {
    keyPair = await JsonWebKey.from(rawKeyJson as Ed25519VerificationKey2018);
    expect(keyPair.controller).toBe(rawKeyJson.controller);
  });

  it("define suite", async () => {
    suite = new JsonWebSignature({
      key: keyPair,
      date: credential.issuanceDate
    });
    expect(suite.verificationMethod).toBe(rawKeyJson.id);
  });

  it("create verifiable credential", async () => {
    const result = await vcjs.verifiable.credential.create({
      format: ["vc-jwt"],
      credential: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/traceability/v1"
        ],
        type: ["VerifiableCredential"],
        issuanceDate: "2018-02-24T05:28:04Z",
        expirationDate: "2024-02-24T05:28:04Z",
        credentialSubject: { id: "did:example:234" },
        name: "Test 1",
        description: "Example Credential 1",
        issuer: {
          id: keyPair.controller
        }
      },
      suite,
      documentLoader
    });
    verifiableCredential = result.items[0];
  });

  it("Verify verifiable credential", async () => {
    const response = await vcjs.verifiable.credential.verify({
      credential: verifiableCredential,
      format: ["vc-jwt"],
      documentLoader,
      suite: [new JsonWebSignature()]
    });
    expect(response.verified).toBe(true);
    expect(response.verifications.length).toBe(3);
  });
});
