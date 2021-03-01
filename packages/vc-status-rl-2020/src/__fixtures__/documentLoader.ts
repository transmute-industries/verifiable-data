import { DocumentLoader } from '../types/DocumentLoader';

import { contexts } from '../contexts';

import { revocationListCredential } from './revocationListCredential';
import signedRevocationListt2020 from './signed-revocation-list-2020.json';
import didDocument from './didDocument.json';
export const documentLoader: DocumentLoader = async (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }

  if (iri === 'https://example.com/status/1') {
    return {
      documentUrl: iri,
      document: revocationListCredential,
    };
  }
  if (iri === 'https://example.com/status/2') {
    return {
      documentUrl: iri,
      document: signedRevocationListt2020,
    };
  }

  if (
    iri.startsWith('did:key:z6MkjdvvhidKavKoWwkdf4Sb8JkHTvnFUsGxvbmNMJUBPJs4')
  ) {
    return {
      documentUrl: iri,
      document: didDocument,
    };
  }

  console.error('Unsupported iri ' + iri);
  throw new Error('Unsupported iri ' + iri);
};
