import crypto from 'crypto';

export * from './documentLoader';
export * from './getAllCredentialsInDirectory';

export const sha256 = (data: Buffer) => {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest();
};
