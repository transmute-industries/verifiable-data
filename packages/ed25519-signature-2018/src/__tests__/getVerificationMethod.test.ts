import { Ed25519Signature2018 } from "../index";
import DigitalBazzarCredential from "../__fixtures__/credentials/digital-bazaar.json";
import TransmuteCredential from "../__fixtures__/credentials/transmute.json";
import documentLoader from "../__fixtures__/documentLoader";
import { purposes } from "@transmute/linked-data-proof";

// IBYRNE - 02/03/2022
// Test added for issue reported here: https://difdn.slack.com/archives/C4X50SNUX/p1643793079624299?thread_ts=1643731070.971909&cid=C4X50SNUX
// Previously this test was failing because of the shape of our object being returned
// from the getVerificationMethod did not match what's expected in the purpose.validate() function.
// Now these tests should pass
describe("Verification testing", () => {
    it("DigitalBazaar credential should verify", async () => {
        const suite = new Ed25519Signature2018();
        const { proof, ...document } = DigitalBazzarCredential;
        const verifiedProof = await suite.verifyProof({
            proof,
            document: document,
            purpose: new purposes.AssertionProofPurpose(),
            documentLoader: documentLoader
        });
        expect(verifiedProof.verified).toBe(true);
    });

    it("Transmute credential should verify", async () => {
        const suite = new Ed25519Signature2018();
        const { proof, ...document } = TransmuteCredential;
        const verifiedProof = await suite.verifyProof({
            proof,
            document: document,
            purpose: new purposes.AssertionProofPurpose(),
            documentLoader: documentLoader
        });
        expect(verifiedProof.verified).toBe(true);
    });
});