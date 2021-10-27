import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import documentLoader from "../__fixtures__/documentLoader";
// import expectedProof from "../__fixtures__/proof.json";

const credential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    {
      "@vocab": "http://example.com/terms#"
    }
  ],
  id: "https://example.com/credentials/1872",
  type: ["VerifiableCredential"],
  issuer: rawKeyJson.controller,
  issuanceDate: "2010-01-01T19:23:24Z",
  credentialSubject: {
    type: ["Foo"],
    level1: "level1",
    bar: {
      id: "urn:uuid:456",
      level2: "level2",
      baz: {
        level3: "level3"
      }
    }
  }
};
let proof: any;
const purpose = {
  // ignore validation of dates and such...
  validate: () => {
    return { valid: true };
  },
  update: (proof: any) => {
    proof.proofPurpose = "assertionMethod";
    return proof;
  }
};
describe("suite", () => {
  it("should create proof with many terms", async () => {
    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    const suite = new Ed25519Signature2018({
      key: keyPair,
      date: credential.issuanceDate
    });
    proof = await suite.createProof({
      document: credential,
      purpose,
      documentLoader,
      compactProof: false
    });
    // console.log(JSON.stringify(proof, null, 2));
  });
  it("should verify when terms are not tampered with", async () => {
    const suite = new Ed25519Signature2018();
    const result = await suite.verifyProof({
      proof,
      document: credential,
      purpose,
      documentLoader,
      compactProof: false
    });
    expect(result.verified).toBeTruthy();
  });

  it("should fail to verify when a term on level 1 is dropped", async () => {
    const suite = new Ed25519Signature2018();
    const tampered = JSON.parse(JSON.stringify(credential));
    delete tampered.credentialSubject.level1;
    const result = await suite.verifyProof({
      proof,
      document: tampered,
      purpose,
      documentLoader,
      compactProof: false
    });
    expect(result.verified).toBe(false);
  });

  it("should fail to verify when a term on level 2 is dropped", async () => {
    const suite = new Ed25519Signature2018();
    const tampered = JSON.parse(JSON.stringify(credential));
    delete tampered.credentialSubject.bar;
    const result = await suite.verifyProof({
      proof,
      document: tampered,
      purpose,
      documentLoader,
      compactProof: false
    });
    expect(result.verified).toBe(false);
  });

  it("should fail to verify when a term on level 3 is dropped", async () => {
    const suite = new Ed25519Signature2018();
    const tampered = JSON.parse(JSON.stringify(credential));
    delete tampered.credentialSubject.bar.baz;
    const result = await suite.verifyProof({
      proof,
      document: tampered,
      purpose,
      documentLoader,
      compactProof: false
    });
    expect(result.verified).toBe(false);
  });
});
