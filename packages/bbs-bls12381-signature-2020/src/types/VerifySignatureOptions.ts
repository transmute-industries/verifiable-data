// https://github.com/mattrglobal/jsonld-signatures-bbs/blob/a1271750ed5211f1210323534402575967e4fae2/src/types/VerifySignatureOptions.ts#L18
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Options for verifying a signature
 */
export interface VerifySignatureOptions {
  /**
   * Document to verify
   */
  readonly document: any;
  /**
   * Array of statements to verify
   */
  readonly verifyData: Uint8Array[];
  /**
   * Verification method to verify the signature against
   */
  readonly verificationMethod: any;
  /**
   * Proof to verify
   */
  readonly proof: any;
  /**
   * Optional custom document loader
   */
  documentLoader?: Function;
  /**
   * Optional expansion map
   */
  expansionMap?: Function;
}
