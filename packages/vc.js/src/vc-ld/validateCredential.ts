import { IVerifyOptions } from '../types';

import { verifyCredential } from './verify';
import moment from 'moment';

export const validateCredential = async (options: IVerifyOptions) => {
  const validations = [];

  const verificationResults = await verifyCredential(options);

  validations.push({
    valid: verificationResults.verified,
    title: 'Signature',
    description: options.credential.proof.verificationMethod,
  });

  if (options.credential.issuanceDate) {
    const issuanceMoment = moment(options.credential.issuanceDate);
    const valid = issuanceMoment.isBefore(moment.now());
    validations.push({
      valid,
      title: 'Activation',
      description: `This credential ${
        valid ? 'activated' : 'activates'
      } ${issuanceMoment.fromNow()}`,
    });
  }

  if (options.credential.expirationDate) {
    const expirationMoment = moment(options.credential.expirationDate);
    const valid = expirationMoment.isAfter(moment.now());
    validations.push({
      valid,
      title: 'Expiration',
      description: `This credential ${
        valid ? 'expires' : 'expired'
      } ${expirationMoment.fromNow()}`,
    });
  }

  return {
    valid: validations.every((v) => {
      return v.valid;
    }),
    validations,
  };
};
