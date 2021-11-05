const dids = {
  "did:key:z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk": require("../src/__fixtures__/1-dids/did-document.json"),
};
const contexts = {
  "https://www.w3.org/2018/credentials/v1": require("../src/__fixtures__/1-contexts/credential-v1.json"),
  "https://w3id.org/traceability/v1": require("../src/__fixtures__/1-contexts/trace-v1.json"),
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
