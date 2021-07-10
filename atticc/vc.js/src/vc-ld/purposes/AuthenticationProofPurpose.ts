import { ControllerProofPurpose } from './ControllerProofPurpose';
import { IPurposeValidateOptions } from '../../types';

export class AuthenticationProofPurpose extends ControllerProofPurpose {
  public challenge: string;
  public domain: string;
  constructor({
    term = 'authentication',
    controller,
    challenge,
    date,
    domain,
    maxTimestampDelta = Infinity,
  }: any = {}) {
    super({ term, controller, date, maxTimestampDelta });
    if (typeof challenge !== 'string') {
      throw new TypeError('"challenge" must be a string.');
    }
    if (domain !== undefined && typeof domain !== 'string') {
      throw new TypeError('"domain" must be a string.');
    }
    this.challenge = challenge;
    this.domain = domain;
  }

  async validate(
    proof: any,
    {
      verificationMethod,
      documentLoader,
      expansionMap,
    }: IPurposeValidateOptions
  ) {
    try {
      // check challenge
      if (proof.challenge !== this.challenge) {
        throw new Error(
          'The challenge is not as expected; ' +
            `challenge="${proof.challenge}", expected="${this.challenge}"`
        );
      }

      // check domain
      if (this.domain !== undefined && proof.domain !== this.domain) {
        throw new Error(
          'The domain is not as expected; ' +
            `domain="${proof.domain}", expected="${this.domain}"`
        );
      }

      return super.validate(proof, {
        verificationMethod,
        documentLoader,
        expansionMap,
      });
    } catch (error) {
      return { valid: false, error };
    }
  }

  async update(proof: any, _options: IPurposeValidateOptions) {
    proof = await super.update(proof, _options);
    proof.challenge = this.challenge;
    if (this.domain !== undefined) {
      proof.domain = this.domain;
    }
    return proof;
  }
}
