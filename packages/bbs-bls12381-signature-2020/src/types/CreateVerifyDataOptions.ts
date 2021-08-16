// orignally from
// https://github.com/mattrglobal/jsonld-signatures-bbs/blob/a1271750ed5211f1210323534402575967e4fae2/src/types/CreateVerifyDataOptions.ts#L18
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Options for creating a proof
 */
export interface CreateVerifyDataOptions {
  /**
   * Document to create the proof for
   */
  readonly document: any;
  /**
   * The proof
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
  /**
   * Indicates whether to compact the proof
   */
  readonly compactProof: boolean;
}
