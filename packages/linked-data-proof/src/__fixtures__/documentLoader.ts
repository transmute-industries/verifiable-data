const dids: any = {
  // proof context
  "did:key:z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk#z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk": require("./1-dids/did-document.json"),
  "did:key:z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk": require("./1-dids/did-document.json")
};
const contexts: any = {
  // document context
  "https://www.w3.org/2018/credentials/v1": require("./1-contexts/credential-v1.json"),
  "https://w3id.org/traceability/v1": require("./1-contexts/trace-v1.json"),
  // proof context
  "https://www.w3.org/ns/did/v1": require("./1-contexts/did-v1.json"),
  "https://w3id.org/security/suites/ed25519-2018/v1": require("./1-contexts/ed25519-2018-v1.json"),
  "https://w3id.org/security/suites/x25519-2019/v1": require("./1-contexts/x25519-2019-v1.json")
};
const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  if (dids[iri]) {
    return { document: dids[iri] };
  }
  // console.warn(iri);
  throw new Error(`iri ${iri} not supported`);
};

export default documentLoader;
