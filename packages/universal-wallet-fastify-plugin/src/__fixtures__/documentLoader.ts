import axios from 'axios';
import * as ed25519 from '@transmute/did-key-ed25519';
import * as bls12381 from '@transmute/did-key-bls12381';

import { contexts } from '../contexts';

import testDidDoc from '../test-data/did-doc.json';

export const documentLoader = async (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }

  if (iri.startsWith('did:key:z6M')) {
    const { didDocument } = await ed25519.driver.resolve(iri, {
      accept: 'application/did+ld+json',
    });
    return {
      documentUrl: iri,
      document: didDocument,
    };
  }

  if (iri.startsWith('did:key:zUC')) {
    const { didDocument } = await bls12381.driver.resolve(iri, {
      accept: 'application/did+ld+json',
    });
    return {
      documentUrl: iri,
      document: didDocument,
    };
  }

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

  console.error('documentLoader: ', iri);
  throw new Error('Unsupported iri ' + iri);
};
