/**
 * In this test we want to confirm how issuanceDate values are
 * handled when irregular or incrrect values are provided to the
 * suite when signed.
 * In this test we will confirm the operation of Transmute's
 * libraries using fixtures generated from Digital Bazaar's library
 **/

import undefinedSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-1.json";
import nullSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-2.json";
import zeroSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-3.json";
import emptyStringSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-4.json";
import foobarStringSuiteFixture from "../../__fixtures__/credentials/suiteConstructor/case-5.json";

import {
    issuedOn,
    createCredential,
    createSuite,
    signCredential,
    isDateValidXmlSchema,
    verifyProof
} from "./date-utils";

describe("Handling irregular date value provided into suite", () => {

    // Pattern 1, undefined date provided into suite
    // Current time is used for created value in proof

    it("should create suite with an undefined date", async () => {
        // Create a suite using undefined for the date parameter that gets passed into the suite
        const { suite, suiteError } = await createSuite(undefined);

        // There will be no error, the date attribute on suite will be undefined
        expect(suite).toBeDefined();
        expect(suite!.date).toBeUndefined();
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
        expect(undefinedSuiteFixture.proof).toBeDefined();
        // And the created attribute for the proof is the time the fixture was generated
        expect(undefinedSuiteFixture.proof.created).toBeDefined();

        // Both Transmute and Digital Bazaar should have valid dates
        expect(isDateValidXmlSchema(proof!.created)).toBeTruthy();
        expect(
            isDateValidXmlSchema(undefinedSuiteFixture.proof.created)
        ).toBeTruthy();

        // We expect the proofs to verify for both our credential and for the fixture
        const verification = await verifyProof(credential);
        console.log(verification);

        expect((await verifyProof(credential)).verified).toBeTruthy();
        expect((await verifyProof(undefinedSuiteFixture)).verified).toBeTruthy();
    });

    it("should create suite with a null date", async () => {
        // Create a suite using null for the date parameter that gets passed into the suite
        const { suite, suiteError } = await createSuite(null);

        // There will be no error, the date attribute on suite will be undefined
        expect(suite).toBeDefined();
        expect(suite!.date).toBeUndefined();
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
        expect(nullSuiteFixture.proof).toBeDefined();
        // And the created attribute for the proof is the time the fixture was generated
        expect(nullSuiteFixture.proof.created).toBeDefined();

        // Both Transmute and Digital Bazaar should have valid dates
        expect(isDateValidXmlSchema(proof!.created)).toBeTruthy();
        expect(isDateValidXmlSchema(nullSuiteFixture.proof.created)).toBeTruthy();

        // We expect the proofs to verify for both our credential and for the fixture
        expect((await verifyProof(credential)).verified).toBeTruthy();
        expect((await verifyProof(nullSuiteFixture)).verified).toBeTruthy();
    });

    it("should create suite with a zero date", async () => {
        // Create a suite using zero for the date parameter that gets passed into the suite
        const { suite, suiteError } = await createSuite(0);

        // There will be no error, the date attribute on suite will be undefined
        expect(suite).toBeDefined();
        expect(suite!.date).toBeUndefined();
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
        expect(zeroSuiteFixture.proof).toBeDefined();
        // And the created attribute for the proof is the time the fixture was generated
        expect(zeroSuiteFixture.proof.created).toBeDefined();

        // Both Transmute and Digital Bazaar should have valid dates
        expect(isDateValidXmlSchema(proof!.created)).toBeTruthy();
        expect(isDateValidXmlSchema(zeroSuiteFixture.proof.created)).toBeTruthy();

        // We expect the proofs to verify for both our credential and for the fixture
        expect((await verifyProof(credential)).verified).toBeTruthy();
        expect((await verifyProof(zeroSuiteFixture)).verified).toBeTruthy();
    });

    it("should create suite with an empty string date", async () => {
        // Create a suite using "" for the date parameter that gets passed into the suite
        const { suite, suiteError } = await createSuite("");

        // There will be no error, the date attribute on suite will be undefined
        expect(suite).toBeDefined();
        expect(suite!.date).toBeUndefined();
        expect(suiteError).toBeUndefined();

        // Create a valid credential to be signed
        const credential = createCredential(issuedOn);

        // Sign the valid credential with undefined date suite
        const { proof, signError } = await signCredential(suite!, credential);
        expect(proof).toBeDefined();

        // Specifically the created attribute should be the current time
        expect(proof!.created).toBeDefined();
        expect(signError).toBeUndefined();
        credential.proof = proof;

        // Compare against fixture result, we expect a proof
        expect(emptyStringSuiteFixture.proof).toBeDefined();
        // And the created attribute for the proof is the time the fixture was generated
        expect(emptyStringSuiteFixture.proof.created).toBeDefined();

        // Both Transmute and Digital Bazaar should have valid dates
        expect(isDateValidXmlSchema(proof!.created)).toBeTruthy();
        expect(
            isDateValidXmlSchema(emptyStringSuiteFixture.proof.created)
        ).toBeTruthy();

        // We expect the proofs to verify for both our credential and for the fixture
        expect((await verifyProof(credential)).verified).toBeTruthy();
        expect((await verifyProof(emptyStringSuiteFixture)).verified).toBeTruthy();
    });

    // Pattern 2, invalid date value causes error to be thrown
    // in suite, can't proceed from there
    it("should create suite with foobar string", async () => {
        // Create a suite using foobar for the date parameter that gets passed into the suite
        const { suite, suiteError } = await createSuite("foobar");

        // There will be error, so the suite should be undefined
        expect(suite).toBeUndefined();
        // We expect the suite error to be defined, and we expect the type to be 'error'
        expect(suiteError).toBeDefined();
        expect(suiteError!.type).toBe("error");

        // We expect the fixture to also be an error
        expect(foobarStringSuiteFixture.type).toBe("error");

        // We expect both our library and digital bazaar's library to have thrown on suite
        expect(suiteError!.thrownOn).toBe("suite");
        expect(foobarStringSuiteFixture.thrownOn).toBe("suite");
    });
});
