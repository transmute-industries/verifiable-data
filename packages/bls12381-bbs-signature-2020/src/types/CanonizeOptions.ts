// https://github.com/mattrglobal/jsonld-signatures-bbs/blob/a1271750ed5211f1210323534402575967e4fae2/src/types/CanonizeOptions.ts#L18
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Options for canonizing a document
 */
export interface CanonizeOptions {
  /**
   * Optional custom document loader
   */
  documentLoader?: Function;
  /**
   * Optional expansion map
   */
  expansionMap?: Function;
  /**
   * Indicates whether to skip expansion during canonization
   */
  readonly skipExpansion?: boolean;
}
