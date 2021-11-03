import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";

import * as ldp from "..";
import rawKeyJson from "../__fixtures__/1-keys/key.json";
import credential from "../__fixtures__/1-credentials/case-1.json";
import documentLoader from "../__fixtures__/documentLoader";
import expectedVerifiableCredential from "../__fixtures__/1-verifiable-credentials/digital-bazaar/case-1.json";

const purpose = new ldp.purposes.AssertionProofPurpose();
let keyPair: Ed25519VerificationKey2018;
let suite: Ed25519Signature2018;
let verifiableCredential: any;

describe("create and verify verifiable credential", () => {
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
    verifiableCredential = await ldp.sign(credential, {
      suite,
      purpose,
      documentLoader,
      expansionMap: false,
      compactProof: false
    });
  });
  it("should match fixture", () => {
    expect(expectedVerifiableCredential).toEqual(verifiableCredential);
  });

  it("verify verifiable credential", async () => {
    const result = await ldp.verify(verifiableCredential, {
      suite: new Ed25519Signature2018(),
      purpose,
      documentLoader
    });
    expect(verifiableCredential.proof["@context"]).toBeFalsy();
    expect(result.verified).toBeTruthy();
  });
});
