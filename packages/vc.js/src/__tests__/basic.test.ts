import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";

import * as vcjs from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import credential from "../__fixtures__/credentials/case-1.json";
import documentLoader from "../__fixtures__/documentLoader";
import expectedVerifiableCredential from "../__fixtures__/verifiable-credentials/digital-bazaar/case-1.json";

let keyPair: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;
let verifiableCredential: any;
describe("create and verify verifiable credentials", () => {
  it("import key", async () => {
    keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    expect(keyPair.controller).toBe(rawKeyJson.controller);
  });

  it("define suite", async () => {
    suite = new Ed25519Signature2018({
      key: keyPair,
      date: credential.issuanceDate
    });
    expect(suite.verificationMethod).toBe(rawKeyJson.id);
  });

  it("create verifiable credential", async () => {
    const result = await vcjs.verifiable.credential.create({
      format: ["vc"],
      credential,
      suite,
      documentLoader
    });
    verifiableCredential = result.items[0];
  });

  it("should match fixture", async () => {
    expect(expectedVerifiableCredential).toEqual(verifiableCredential);
  });

  it("verify verifiable credential", async () => {
    const result = await vcjs.verifiable.credential.verify({
      credential: verifiableCredential,
      format: ["vc"],
      documentLoader,
      suite: [new Ed25519Signature2018()]
    });
    expect(verifiableCredential.proof["@context"]).toBeFalsy();
    expect(result.verified).toBeTruthy();
  });
});
