import { Ed25519Signature2018, Ed25519VerificationKey2018 } from "..";
import moment from "moment";
import fs from "fs";
import path from "path";
import rawKeyJson from "../__fixtures__/keys/key.json";
import documentLoader from "../__fixtures__/documentLoader";
import credential from "../__fixtures__/credentials/case-7.json";

const ISSUED_ON = new Date("1991-08-25T12:33:56.789Z").getTime();
const CREATED_ON = new Date("2021-10-15T12:33:56.789Z").getTime();

const TESTS = [
    // Used as a flag to unset `issuanceDate` in the document for the 1st and 4th tests
    // This behavior doesn't carry over to tests 2 and 3 and is treated as a duplicate null test
    "removed",
    undefined,
    null,
    0,
    "",
    "foobar",
    // Int conditions
    1635774995208,
    -1635774995208,
    1,
    -1,
    123,
    -123,
    12345,
    -12345,
    // Date String conditions
    moment(ISSUED_ON).format(),
    moment(ISSUED_ON).format("dddd, MMMM Do YYYY, h:mm:ss a"),
    moment(ISSUED_ON).format("Do dddd MMMM gggg"),
    moment(ISSUED_ON).format("dddd MMMM DD, YYYY"),
    moment(ISSUED_ON).format("D MMM YYYY"),
    moment(ISSUED_ON).format("YYYY-MM-DD"),
    moment(ISSUED_ON).format("ddd, DD MMM YYYY HH:mm:ss z"),
    moment(ISSUED_ON).format("MM DD YYYY"),
    moment(ISSUED_ON).format("MMM D, YYYY"),
    moment(ISSUED_ON).format("YYYY-MM-DD[T]HH:mm:ss"),
    moment(ISSUED_ON).format("YYYY-MM-DD[T]HH:mm:ss:SSSZ"),
    moment(ISSUED_ON).format("YYYY-MM-DD[T]HH:mm:ss[Z]"),
    moment(ISSUED_ON).format("YYYY-MM-DD[T]HH:mmZ"),
    moment(ISSUED_ON).toJSON(),
    moment(ISSUED_ON).toArray(),
    moment(ISSUED_ON).toObject()
];

const createSuite = async (suiteDate: any) => {
    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);

    let suite, suiteError;
    try {
        suite = new Ed25519Signature2018({
            key: keyPair,
            date: suiteDate
        });
    } catch (err) {
        const error = err as Error;
        suiteError = {
            type: "error",
            thrownOn: "suite",
            reason: error.toString()
        };
        return { suite, suiteError };
    }

    if (typeof suite.date === "undefined") {
        suite.date = new Date(CREATED_ON);
    }

    return { suite, suiteError };
};

const signCredential = async (
    suite: Ed25519Signature2018,
    unsignedCredential: any
) => {
    let signedError;
    const signedCredential = { ...unsignedCredential };

    try {
        signedCredential.proof = await suite.createProof({
            document: unsignedCredential,
            purpose: {
                // ignore validation of dates and such...
                validate: () => {
                    return { valid: true };
                },
                update: (proof: any) => {
                    proof.proofPurpose = "assertionMethod";
                    return proof;
                }
            },
            documentLoader,
            compactProof: false
        });
    } catch (err) {
        let error = err as Error;
        signedError = {
            type: "error",
            thrownOn: "sign",
            reason: error.toString()
        };
        return { signedCredential, signedError };
    }

    return { signedCredential, signedError };
};

const verifyProof = async (document: any, proof: any) => {
    const keyPair = await Ed25519VerificationKey2018.from(rawKeyJson);
    const suite = new Ed25519Signature2018({
        key: keyPair,
        date: proof.created
    });

    const result = await suite.verifyProof({
        proof: proof,
        document: document,
        purpose: {
            // ignore validation of dates and such...
            validate: () => {
                return { valid: true };
            },
            update: (proof: any) => {
                proof.proofPurpose = "assertionMethod";
                return proof;
            }
        },
        documentLoader,
        compactProof: false
    });

    return result;
};

const getFixture = (testNum: number, index: number) => {
    const dirs = [
        "issuanceDate",
        "suiteConstructor",
        "suiteDirect",
        "issuanceDateSuite"
    ];

    const filename = path.resolve(
        __dirname,
        `../__fixtures__/credentials/${dirs[testNum - 1]}/case-${index}.json`
    );

    const data = fs.readFileSync(filename, "utf-8");
    return JSON.parse(data);
};

const compareResults = async (output: any, fixture: any) => {
    // Option 1, The fixture has an error and we don't
    if (fixture.type === "error" && output.type !== "error") {
        return expect(output).toBe(fixture);
    } else if (fixture.type !== "error" && output.type === "error") {
        return expect(output).toBe(fixture);
    } else if (fixture.type === "error" && output.type !== "error") {
        console.warn("Fixure: ", fixture.reason);
        console.warn("Output: ", output.reason);
        return expect(output.thrownOn).toBe(fixture.thrownOn);
    }

    const outputProof = output.proof;
    delete output.proof;

    const fixtureProof = fixture.proof;
    delete fixture.proof;

    // We make sure the input documents are the same
    expect(output).toEqual(fixture);

    // Then we want to make that the created dates and hashes work
    expect(outputProof.created).toEqual(fixtureProof.created);
    expect(outputProof.jws).toEqual(fixtureProof.jws);

    // We also expect that the signed credentials are verifiable
    const result = await verifyProof(fixture, fixtureProof);
    expect(result.verified).toBeTruthy();
};

describe("Test 1. Confirm behavior of issuanceDate", () => {

    const testNum = 1;
    for (let i = 0; i < TESTS.length; i++) {
        const date = TESTS[i];
        it(`1. case-${i} should match the verifiable credential`, async () => {
            const fixture = getFixture(testNum, i);
            const { suite, suiteError } = await createSuite(CREATED_ON);
            if (suiteError) {
                return compareResults(suiteError, fixture);
            }

            const unsignedCredential = { ...credential };

            switch (date) {
                case "removed":
                    // @ts-ignore
                    delete unsignedCredential.issuanceDate;
                    break;
                default:
                    // @ts-ignore
                    unsignedCredential.issuanceDate = date;
                    break;
            }

            const { signedCredential, signedError } = await signCredential(
                suite!,
                unsignedCredential
            );
            if (signedError) {
                return compareResults(suiteError, fixture);
            }

            await compareResults(signedCredential, fixture);
        });
    }

});

describe("Test 2. Confirm behavior of suite date constructor", () => {

    const testNum = 2;
    for (let i = 0; i < TESTS.length; i++) {
        const date = TESTS[i];
        it(`2. case-${i} should match the verifiable credential`, async () => {
            const fixture = getFixture(testNum, i);
            const { suite, suiteError } = await createSuite(date === "removed" ? null : date);
            if (suiteError) {
                return compareResults(suiteError, fixture);
            }

            const unsignedCredential = { ...credential };
            const { signedCredential, signedError } = await signCredential(
                suite!,
                unsignedCredential
            );
            if (signedError) {
                return compareResults(suiteError, fixture);
            }

            await compareResults(signedCredential, fixture);
        });
    }

});
