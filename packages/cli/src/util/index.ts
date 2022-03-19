import crypto from 'crypto';

export * from './documentLoader';
export * from './getAllCredentialsInDirectory';
export * from './getCredentialFromFile';
export * from './getKeyFromFile';
export * from './getPresentationFromFile';
export * from './handleCommandResponse';
export * from './getPayloadFromFile';

export const sha256 = (data: Buffer) => {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest();
};
