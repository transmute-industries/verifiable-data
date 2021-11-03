const dids = {
  "did:key:z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk": require("../src/__fixtures__/dids/did-0.json"),
};
const contexts = {
  "https://www.w3.org/2018/credentials/v1": require("../src/__fixtures__/contexts/cred-v1.json"),
  "https://w3id.org/traceability/v1": require("../src/__fixtures__/contexts/trace-v1.json"),
  "https://www.w3.org/ns/did/v1": require("../src/__fixtures__/contexts/did-v1.json"),
  "https://w3id.org/security/suites/ed25519-2018/v1": require("../src/__fixtures__/contexts/ed25519-v1.json"),
  "https://w3id.org/security/suites/x25519-2019/v1": require("../src/__fixtures__/contexts/x25519-v1.json"),
};

const documentLoader = (iri) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  if (dids[iri]) {
    return { document: dids[iri] };
  }
  console.warn(iri);
  throw new Error(`iri ${iri} not supported`);
};

module.exports = documentLoader;
