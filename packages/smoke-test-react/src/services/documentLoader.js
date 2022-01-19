import { contexts } from "./contexts";
export const documentLoader = (iri) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  const message = "Unsupported iri: " + iri;
  console.error(message);
  throw new Error(message);
};
