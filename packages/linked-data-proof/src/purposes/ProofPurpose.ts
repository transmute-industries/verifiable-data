import { IPurposeValidateOptions } from "../types";

export class ProofPurpose {
  public term: any;
  public date: any;
  public maxTimestampDelta: any;

  constructor({ term, date, maxTimestampDelta = Infinity }: any = {}) {
    if (term === undefined) {
      throw new Error('"term" is required.');
    }
    if (
      maxTimestampDelta !== undefined &&
      typeof maxTimestampDelta !== "number"
    ) {
      throw new TypeError('"maxTimestampDelta" must be a number.');
    }
    this.term = term;
    if (date !== undefined) {
      this.date = new Date(date);
      if (isNaN(this.date)) {
        throw TypeError(`"date" "${date}" is not a valid date.`);
      }
    }
    this.maxTimestampDelta = maxTimestampDelta;
  }

  async validate(proof: any, _options: IPurposeValidateOptions) {
    try {
      // check expiration
      if (this.maxTimestampDelta !== Infinity) {
        const expected = (this.date || new Date()).getTime();
        const delta = this.maxTimestampDelta * 1000;
        const created = new Date(proof.created).getTime();
        // comparing this way handles NaN case where `created` is invalid
        if (!(created >= expected - delta && created <= expected + delta)) {
          throw new Error("The proof's created timestamp is out of range.");
        }
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error };
    }
  }

  async update(proof: any, _options: IPurposeValidateOptions) {
    proof.proofPurpose = this.term;
    return proof;
  }

  /**
   * Determines if the given proof has a purpose that matches this instance,
   * i.e. this ProofPurpose instance should be used to validate the given
   * proof.
   *
   * @param proof {object} the proof to check.
   *
   * @return {Promise<boolean>} `true` if there's a match, `false` if not.
   */
  async match(
    proof: any
    // { document, documentLoader, expansionMap }
  ) {
    return proof.proofPurpose === this.term;
  }
}
