import { Ed25519Signature2018 } from "../index";
import DigitalBazzarCredential from "../__fixtures__/credentials/digital-bazaar.json";
import TransmuteCredential from "../__fixtures__/credentials/transmute.json";
import RevocationCredential from "../__fixtures__/credentials/revocation-list.json";
import documentLoader from "../__fixtures__/documentLoader";
import { purposes } from "@transmute/linked-data-proof";

// IBYRNE - 02/03/2022
// Test added for issue reported here: https://difdn.slack.com/archives/C4X50SNUX/p1643793079624299?thread_ts=1643731070.971909&cid=C4X50SNUX
const mockPurpose = {
  term: "assertionMethod",
  maxTimestampDelta: Infinity,
  validate: () => {
    return { valid: true };
  },
  update: (proof: any) => {
    proof.proofPurpose = "assertionMethod";
    return proof;
  }
};

// Using a mock purpose, these credentials should verify.
describe("Transmute and DB VCs validate with mock purpose (SHOULD PASS)", () => {
  it("DigitalBazaar credential should verify", async () => {
    const suite = new Ed25519Signature2018();
    const { proof, ...document } = DigitalBazzarCredential;
    const verifiedProof = await suite.verifyProof({
      proof,
      document: document,
      purpose: mockPurpose,
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
      purpose: mockPurpose,
      documentLoader: documentLoader
    });
    expect(verifiedProof.verified).toBe(true);
  });
});

// Using purpose from linked-data-proof, these should NOT verify.
// Once they are passing, the issue reported in DIF has been resolved.
describe("Transmute and DB VCs verify with linked-data-proof purpose", () => {
  xit("DigitalBazaar credential should NOT verify", async () => {
    const suite = new Ed25519Signature2018();
    const { proof, ...document } = DigitalBazzarCredential;
    const verifiedProof = await suite.verifyProof({
      proof,
      document: document,
      purpose: new purposes.AssertionProofPurpose(),
      documentLoader: documentLoader
    });

    expect(verifiedProof.verified).toBe(false);
  });

  xit("Transmute credential should NOT verify", async () => {
    const suite = new Ed25519Signature2018();
    const { proof, ...document } = TransmuteCredential;
    const verifiedProof = await suite.verifyProof({
      proof,
      document: document,
      purpose: new purposes.AssertionProofPurpose(),
      documentLoader: documentLoader
    });
    expect(verifiedProof.verified).toBe(false);
  });
});

// When these tests pass, the issue has been resolved.
describe("Transmute and DB VCs verify with linked-data-proof purpose", () => {
  it("Revocable credential should verify", async () => {
    const suite = new Ed25519Signature2018();
    const { proof, ...document } = RevocationCredential;
    const verifiedProof = await suite.verifyProof({
      proof,
      document: document,
      purpose: new purposes.AssertionProofPurpose(),
      documentLoader: documentLoader
    });
    expect(verifiedProof.verified).toBe(true);
  });

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
