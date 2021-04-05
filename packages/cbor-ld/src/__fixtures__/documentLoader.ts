import { contexts } from './contexts';
export const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }
  const message = 'Unsupported iri ' + iri;
  console.error(message);
  throw new Error(message);
};
