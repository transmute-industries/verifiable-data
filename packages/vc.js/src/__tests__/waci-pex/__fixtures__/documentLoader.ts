import { contexts } from "./contexts";
import dids from "./dids";

const contextResolver = async (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  return undefined;
};

export const documentLoader = async (iri: string) => {
  const context = await contextResolver(iri);
  if (context) {
    return context;
  }

  if (iri.startsWith("did:key:z5TcDJg")) {
    return { document: dids.bls };
  }

  const message = "Unsupported iri: " + iri;
  console.error(message);
  throw new Error(message);
};
