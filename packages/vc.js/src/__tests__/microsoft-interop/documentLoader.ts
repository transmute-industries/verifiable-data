import didResolution from "./did-resolution.json";
import didV1 from "./contexts/did-v1.json";
import jwsv1 from "./contexts/jws-v1.json";

const contexts: any = {
  "https://www.w3.org/ns/did/v1": didV1,
  "https://w3id.org/security/suites/jws-2020/v1": jwsv1
};

const dids: any = {
  [didResolution.didDocument.id]: didResolution.didDocument
};

export const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }

  const iriWithoutFragment: any = iri.split("#")[0];
  if (dids[iriWithoutFragment]) {
    const didDocument = JSON.parse(JSON.stringify(dids[iriWithoutFragment]));
    didDocument["@context"][1] = "https://w3id.org/security/suites/jws-2020/v1";

    didDocument.verificationMethod[0].controller = didDocument.id;
    didDocument.verificationMethod[0].id =
      didDocument.verificationMethod[0].controller +
      didDocument.verificationMethod[0].id;

    didDocument.verificationMethod[0].type = "JsonWebKey2020";

    didDocument.authentication[0] = didDocument.verificationMethod[0].id;
    didDocument.assertionMethod[0] = didDocument.verificationMethod[0].id;

    // console.log(JSON.stringify(didDocument, null, 2));
    return { document: didDocument };
  }
  const message = "Unsupported iri: " + iri;
  console.warn(message);
  throw new Error(message);
};
