const dids = {
  // ["did:key:z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk"]: require("./dids/did-document.json"),
  ["did:key:z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk#z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk"]: require("../src/__fixtures__/dids/did-document.json"),
};
const contexts = {
  "https://www.w3.org/2018/credentials/v1": require("../src/__fixtures__/contexts/credential-v1.json"),
  "https://w3id.org/security/v1": require("../src/__fixtures__/contexts/security-v1.json"),
  "https://w3id.org/security/v2": require("../src/__fixtures__/contexts/security-v2.json"),
  "https://w3id.org/traceability/v1": require("../src/__fixtures__/contexts/trace-v1.json"),
  "https://w3id.org/vc-revocation-list-2020/v1": require("../src/__fixtures__/contexts/vc-revocation-list-2020-v1.json"),
  "https://www.w3.org/2018/credentials/examples/v1" : require("../src/__fixtures__/contexts/examples-v1.json"),
  "https://www.w3.org/ns/odrl.jsonld" : require("../src/__fixtures__/contexts/odrl.json"),
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
