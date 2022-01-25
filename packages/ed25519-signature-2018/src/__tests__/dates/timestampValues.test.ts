import timestamp0SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-6.json";
import timestamp1SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-7.json";
import timestamp2SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-8.json";
import timestamp3SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-9.json";
import timestamp4SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-10.json";
import timestamp5SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-11.json";
import timestamp6SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-12.json";
import timestamp7SuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-13.json";

import {
  createCredential,
  createSuite,
  isDateValidXmlSchema,
  issuedOn,
  signCredential,
  verifyProof
} from "./date-utils";

describe("Handling timestamp date value provided into suite", () => {
  const suiteContructorTimeStampTest = async (
    date: number,
    fixture: CredentialType
  ): Promise<void> => {
    const { suite, suiteError } = await createSuite(date);
    expect(suite).toBeDefined();
    expect(suite!.date).toBeDefined();
    expect(suiteError).toBeUndefined();

    // Create a valid credential to be signed
    const credential = createCredential(issuedOn);

    // Sign the valid credential with undefined date suite
    const { proof, signError } = await signCredential(suite!, credential);
    expect(proof).toBeDefined();
    credential.proof = proof;

    // Specifically the created attribute should be the current time
    expect(proof!.created).toBeDefined();
    expect(signError).toBeUndefined();

    // Compare against fixture result, we expect a proof
    expect(fixture.proof).toBeDefined();
    // And the created attribute for the proof is the same as the one we generated
    expect(fixture.proof!.created).toBe(proof!.created);

    // Both Transmute and Digital Bazaar should have valid dates
    expect(isDateValidXmlSchema(proof!.created)).toBeTruthy();
    expect(isDateValidXmlSchema(fixture.proof!.created)).toBeTruthy();

    // We expect the proofs to verify for both our credential and for the fixture
    expect((await verifyProof(credential)).verified).toBeTruthy();
    expect((await verifyProof(fixture)).verified).toBeTruthy();
  };

  it("should create suite with 1635774995208", async () => {
    const suiteDate = 1635774995208;
    suiteContructorTimeStampTest(suiteDate, timestamp0SuiteFixture);
  });

  it("should create suite with -1635774995208", async () => {
    const suiteDate = -1635774995208;
    suiteContructorTimeStampTest(suiteDate, timestamp1SuiteFixture);
  });

  it("should create suite with 1", async () => {
    const suiteDate = 1;
    suiteContructorTimeStampTest(suiteDate, timestamp2SuiteFixture);
  });

  it("should create suite with -1", async () => {
    const suiteDate = -1;
    suiteContructorTimeStampTest(suiteDate, timestamp3SuiteFixture);
  });

  it("should create suite with 123", async () => {
    const suiteDate = 1;
    suiteContructorTimeStampTest(suiteDate, timestamp4SuiteFixture);
  });

  it("should create suite with -123", async () => {
    const suiteDate = -1;
    suiteContructorTimeStampTest(suiteDate, timestamp5SuiteFixture);
  });

  it("should create suite with 12345", async () => {
    const suiteDate = 12345;
    suiteContructorTimeStampTest(suiteDate, timestamp6SuiteFixture);
  });

  it("should create suite with -12345", async () => {
    const suiteDate = -12345;
    suiteContructorTimeStampTest(suiteDate, timestamp7SuiteFixture);
  });
});
