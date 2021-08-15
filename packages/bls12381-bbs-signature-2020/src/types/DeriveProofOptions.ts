// orginally from
// https://github.com/mattrglobal/jsonld-signatures-bbs/blob/a1271750ed5211f1210323534402575967e4fae2/src/types/DeriveProofOptions.ts#L18
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Options for creating a proof
 */
export interface DeriveProofOptions {
  /**
   * Document outlining what statements to reveal
   */
  readonly revealDocument: any;
  /**
   * The document featuring the proof to derive from
   */
  readonly document: any;
  /**
   * The proof for the document
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
   * Nonce to include in the derived proof
   */
  readonly nonce?: Uint8Array;
  /**
   * Indicates whether to compact the resulting proof
   */
  readonly skipProofCompaction?: boolean;
}
