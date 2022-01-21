import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";

import * as vcjs from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import credential from "../__fixtures__/credentials/case-1.json";
import documentLoader from "../__fixtures__/documentLoader";

let keyPair: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;
let verifiableCredential: any;

// We found an edge case where pre-processing broke the signature.
// Here are some tests that show this.
// These tests won't ever pass (failure is expected) and the failure is related to pre-processing the credential.
// Eventually we should remove the compactProof option so that these tests are no longer needed.
// https://github.com/transmute-industries/verifiable-data/issues/112#issuecomment-963292075
// FIXME: https://github.com/transmute-industries/verifiable-data/issues/112
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

  it("expansionMap true - Fails to verify verifiable credential", async () => {
    try {
      await vcjs.verifiable.credential.verify({
        credential: verifiableCredential,
        format: ["vc"],
        documentLoader,
        suite: [new Ed25519Signature2018()],
        expansionMap: true
      });
    } catch (e) {
      expect((e as any).message).toBe(
        "The default options are not being used."
      );
    }
  });

  it("expansionMap false - Fails to verify verifiable credential", async () => {
    try {
      await vcjs.verifiable.credential.verify({
        credential: verifiableCredential,
        format: ["vc"],
        documentLoader,
        suite: [new Ed25519Signature2018()],
        expansionMap: false
      });
    } catch (e) {
      expect((e as any).message).toBe(
        "The default options are not being used."
      );
    }
  });
});
