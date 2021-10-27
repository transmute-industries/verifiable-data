import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import rawKeyJson from "../__fixtures__/keys/key.json";
import rawCredentialJson from "../__fixtures__/credentials/case-1.json";
import documentLoader from "../__fixtures__/documentLoader";
import canonicalize from "canonicalize";

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

const expectUntamperedSuccess = async (tampered: any) => {
  const suite = new Ed25519Signature2018();
  // confirm that tampering has NOT occured
  expect(tampered).toEqual(rawCredentialJson);
  const result = await suite.verifyProof({
    // assume function arguments will be mutated.
    proof: JSON.parse(JSON.stringify(proof)),
    // assume function arguments will be mutated.
    document: JSON.parse(JSON.stringify(tampered)),
    purpose,
    documentLoader,
    compactProof: false
  });
  // ensure the credential verifies when it matches the original document
  expect(result.verified).toBe(true);
};

const expectTamperFailure = async (tampered: any) => {
  const suite = new Ed25519Signature2018();
  // confirm that tampering has occured
  expect(tampered).not.toEqual(rawCredentialJson);
  const result = await suite.verifyProof({
    // assume function arguments will be mutated.
    proof: JSON.parse(JSON.stringify(proof)),
    // assume function arguments will be mutated.
    document: JSON.parse(JSON.stringify(tampered)),
    purpose,
    documentLoader,
    compactProof: false
  });
  // ensure the credential fails to verify
  expect(result.verified).toBe(false);
};

it("should create proof with many terms", async () => {
  const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
  const suite = new Ed25519Signature2018({
    key: keyPair,
    date: rawCredentialJson.issuanceDate
  });
  proof = await suite.createProof({
    document: rawCredentialJson,
    purpose,
    documentLoader,
    compactProof: false
  });
  // console.log(JSON.stringify(proof, null, 2));
});

describe("verification should PASS", () => {
  it("when terms are not tampered with", async () => {
    expect.assertions(2);
    // just a copy, no changes.
    const tampered = JSON.parse(JSON.stringify(rawCredentialJson));
    await expectUntamperedSuccess(tampered);
  });

  it("when terms are reordered but object remains the same", async () => {
    expect.assertions(4);
    // canonicalize changes order
    const tampered = JSON.parse(canonicalize(rawCredentialJson));
    // proof that order is changed
    expect(JSON.stringify(tampered)).not.toEqual(
      JSON.stringify(rawCredentialJson)
    );
    // proof that objects are still equal
    expect(tampered).toEqual(rawCredentialJson);
    await expectUntamperedSuccess(tampered);
  });
});

describe("verification should FAIL", () => {
  it("when issuer is changed", async () => {
    expect.assertions(2);
    const tampered = JSON.parse(JSON.stringify(rawCredentialJson));
    tampered.issuer = "did:example:0987";
    await expectTamperFailure(tampered);
  });

  it("when a relatedLink is changed", async () => {
    expect.assertions(2);
    const tampered = JSON.parse(JSON.stringify(rawCredentialJson));
    tampered.relatedLink[0].target = "fooo";
    await expectTamperFailure(tampered);
  });

  it("when a relatedLink is removed", async () => {
    expect.assertions(2);
    const tampered = JSON.parse(JSON.stringify(rawCredentialJson));
    delete tampered.relatedLink;
    await expectTamperFailure(tampered);
  });

  it("when a credentialSubject type is changed", async () => {
    expect.assertions(2);
    const tampered = JSON.parse(JSON.stringify(rawCredentialJson));
    tampered.credentialSubject.type.push("Organization");
    await expectTamperFailure(tampered);
  });
  it("when a credentialSubject type is removed", async () => {
    expect.assertions(2);
    const tampered = JSON.parse(JSON.stringify(rawCredentialJson));
    delete tampered.credentialSubject.type;
    await expectTamperFailure(tampered);
  });

  it("when a product observation measurement is changed", async () => {
    expect.assertions(2);
    const tampered = JSON.parse(JSON.stringify(rawCredentialJson));
    tampered.credentialSubject.product.inspection.observation[0].measurement.value = 9999912312312;
    await expectTamperFailure(tampered);
  });

  it("when a purchase customer phone number is changed", async () => {
    expect.assertions(2);
    const tampered = JSON.parse(JSON.stringify(rawCredentialJson));
    tampered.credentialSubject.purchase.customer.phoneNumber =
      "<script>alert(1);</script>";
    await expectTamperFailure(tampered);
  });
});
