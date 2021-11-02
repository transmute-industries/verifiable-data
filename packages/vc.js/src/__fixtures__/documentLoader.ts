import { dids } from "./dids";
import { contexts } from "./contexts";
import { revocationLists } from "./revocation-lists";

const documentLoader = (iri: string): any => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }

  if (dids[iri.split("#")[0]]) {
    return { document: dids[iri.split("#")[0]] };
  }

  if (revocationLists[iri.split("#")[0]]) {
    return { document: revocationLists[iri.split("#")[0]] };
  }

  console.warn(iri);
  console.log(JSON.stringify(dids, null, 2));
  throw new Error(`iri ${iri} not supported`);
};

export default documentLoader;
