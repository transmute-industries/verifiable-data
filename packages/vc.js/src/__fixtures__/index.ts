export * from './documentLoader';
export * from './vendors';
export const unlockedDid = require('./unlocked-did.json');

export const test_vectors = {
  ld: {
    unlockedDid,
    credentialTemplate: require('./test-vectors/vc-ld/credential-template.json'),
    credentialTemplateInvalidNoContext: require('./test-vectors/vc-ld/credential-template-invalid-no-context.json'),
    credentialTemplateInvalidMissingProperty: require('./test-vectors/vc-ld/credential-template-invalid-missing-property.json'),
    credentialIssued: require('./test-vectors/vc-ld/credential-issued.json'),
    credentialVerified: require('./test-vectors/vc-ld/credential-verified.json'),
    presentationCreated: require('./test-vectors/vc-ld/presentation-created.json'),
    presentationProved: require('./test-vectors/vc-ld/presentation-proved.json'),
    presentationVerified: require('./test-vectors/vc-ld/presentation-verified.json'),
  },
  jwt: {
    unlockedDid,
    credentialTemplate: require('./test-vectors/vc-jwt/credential-template.json'),
    credentialIssued: require('./test-vectors/vc-jwt/credential-issued.json')
      .jwt,
    credentialVerified: require('./test-vectors/vc-jwt/credential-verified.json'),
    presentationCreated: require('./test-vectors/vc-jwt/presentation-created.json'),
    presentationProved: require('./test-vectors/vc-jwt/presentation-proved.json')
      .jwt,
    presentationVerified: require('./test-vectors/vc-jwt/presentation-verified.json'),
  },
};
