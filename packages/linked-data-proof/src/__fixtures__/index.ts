export * from './documentLoader';
export * from './vendors';
export const unlockedDid = require('./unlocked-did.json');
export const docTemplate = require('./doc-template.json');
export const expected = {
  docSigned: require('./expected/doc-signed.json'),
  docVerified: require('./expected/doc-verified.json'),
};
