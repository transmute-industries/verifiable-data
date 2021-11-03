import { dids } from "./dids";

const contexts: any = {
  "https://www.w3.org/2018/credentials/v1": require("./contexts/credential-v1.json"),
  "https://www.w3.org/ns/did/v1": require("./contexts/did-v1.json"),
  "https://w3id.org/security/suites/ed25519-2018/v1": require("./contexts/ed25519-2018-v1.json"),
  "https://w3id.org/security/suites/x25519-2019/v1": require("./contexts/x25519-2019-v1.json"),
  // ["https://w3id.org/security/v2"]: require("./contexts/security-v2.json"),
  // ["https://w3id.org/security/v1"]: require("./contexts/security-v1.json"),
  "https://w3id.org/security/suites/jws-2020/v1": require("./contexts/jws-2020-v1.json")
};

const documentLoader = (iri: string) => {
  const iriWithoutFragment = iri.split("#")[0];

  if (contexts[iri]) {
    return { document: contexts[iri] };
  }

  if (dids[iriWithoutFragment]) {
    return { document: dids[iriWithoutFragment] };
  }
  console.warn(iri);
  throw new Error(`iri ${iri} not supported`);
};

export default documentLoader;
