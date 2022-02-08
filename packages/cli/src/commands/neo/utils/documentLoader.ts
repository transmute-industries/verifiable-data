import { contexts } from './contexts';

export const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }

  const message = 'Unsupported iri: ' + iri;
  console.warn(message);
  throw new Error(message);
};
