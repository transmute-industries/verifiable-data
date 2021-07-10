const unlockedDidDocument = require('./unlocked-did.json');

const localOverrides: any = {
  [unlockedDidDocument.id]: unlockedDidDocument,
  'https://w3id.org/security/v1': require('./contexts/security-v1.json'),
  'https://w3id.org/security/v2': require('./contexts/security-v2.json'),
  'https://w3id.org/did/v0.11': require('./contexts/did-v0.11.json'),
};

export const documentLoader = async (url: string) => {
  const withoutFragment: string = url.split('#')[0];
  if (localOverrides[withoutFragment]) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: localOverrides[withoutFragment], // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  throw new Error(`No custom context support for ${url}`);
};
