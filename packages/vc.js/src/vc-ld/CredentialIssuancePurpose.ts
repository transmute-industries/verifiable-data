import * as ldp from "@transmute/linked-data-proof";

export const { AssertionProofPurpose } = ldp.purposes;

export class CredentialIssuancePurpose extends AssertionProofPurpose {
  constructor({ controller, date, maxTimestampDelta }: any = {}) {
    super({ controller, date, maxTimestampDelta });
  }

  async validate(
    proof: any,
    { document, suite, verificationMethod, documentLoader, expansionMap }: any
  ) {
    try {
      const result = await super.validate(proof, {
        document,
        suite,
        verificationMethod,
        documentLoader,
        expansionMap
      });

      if (!result.valid) {
        throw result.error;
      }

      const issuer =
        typeof document.issuer === "string"
          ? document.issuer
          : document.issuer.id;

      if (!issuer) {
        throw new Error("Credential issuer is required.");
      }

      if (result.controller.id !== issuer) {
        throw new Error(
          "Credential issuer must match the verification method controller."
        );
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error };
    }
  }
}

export default CredentialIssuancePurpose;
