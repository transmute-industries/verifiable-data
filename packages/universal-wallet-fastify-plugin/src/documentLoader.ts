import { contexts } from './contexts';

export const documentLoader = async (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }
  console.error('documentLoader: ', iri);
  throw new Error('Unsupported iri ' + iri);
};
