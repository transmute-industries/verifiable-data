const unlockedDidDocument = require('./unlocked-did.json');

const localOverrides: any = {
  [unlockedDidDocument.id]: unlockedDidDocument,
  'https://www.w3.org/ns/did/v1': require('./contexts/did-v1.json'),
  'https://w3id.org/did/v0.11': require('./contexts/did-v0.11.json'),
  'https://www.w3.org/2018/credentials/v1': require('./contexts/credentials-v1.json'),
  'https://www.w3.org/2018/credentials/v2': require('./contexts/credentials-v1.json'),
  'https://www.w3.org/2018/credentials/examples/v1': require('./contexts/examples-v1.json'),
  'https://www.w3.org/ns/odrl.jsonld': require('./contexts/odrl.json'),
  'https://w3id.org/security/v1': require('./contexts/security-v1.json'),
  'https://w3id.org/security/v2': require('./contexts/security-v2.json'),
  'https://w3id.org/security/v3': require('./contexts/security-v3.json'),
  'https://w3id.org/zkp/v1': require('./contexts/zkp-v1.json'),
  'https://w3id.org/citizenship/v1': require('./contexts/citizenship-v1.json'),
  'https://w3c-ccg.github.io/ldp-bbs2020/context/v1': require('./contexts/zkp-v1.json'),
};

export const documentLoader = async (url: string) => {
  // console.log(url);
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
