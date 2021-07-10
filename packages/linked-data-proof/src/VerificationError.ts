export class VerificationError extends Error {
  public errors: any[];
  constructor(errors: any) {
    super('Verification error(s).');

    this.name = 'VerificationError';
    this.errors = [].concat(errors);
  }
}
