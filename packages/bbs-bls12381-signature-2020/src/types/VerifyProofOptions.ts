// originally from :
// https://github.com/mattrglobal/jsonld-signatures-bbs/blob/a1271750ed5211f1210323534402575967e4fae2/src/types/VerifyProofOptions.ts#L18
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Options for verifying a proof
 */
export interface VerifyProofOptions {
  /**
   * The proof
   */
  readonly proof: any;
  /**
   * The document
   */
  readonly document: any;
  /**
   * The proof purpose to specify for the generated proof
   */
  readonly purpose: any;
  /**
   * Optional custom document loader
   */
  documentLoader?: Function;
  /**
   * Optional expansion map
   */
  expansionMap?: Function;
}
