import axios from 'axios';

import testDidDoc from './test-data/did-doc.json';

export const unsafeDocumentLoader = async (iri: string) => {
  if (iri.startsWith('did:web:platform.example:accounts:123')) {
    return {
      documentUrl: iri,
      document: testDidDoc,
    };
  }
  if (iri.includes('did:web:')) {
    let url = `https://did-web.web.app/api/v1/identifiers/${iri}`;
    const resp = await axios.get(url);
    return {
      documentUrl: iri,
      document: resp.data,
    };
  }

  console.error('unsafeDocumentLoader: ', iri);
  throw new Error('Unsupported iri ' + iri);
};
