// https://github.com/mattrglobal/jsonld-signatures-bbs/blob/a1271750ed5211f1210323534402575967e4fae2/src/types/VerifyProofResult.ts#L17
/**
 * Result of calling verify proof
 */
export interface VerifyProofResult {
  /**
   * A boolean indicating if the verification was successful
   */
  readonly verified: boolean;
  /**
   * A string representing the error if the verification failed
   */
  readonly error?: string;
}
