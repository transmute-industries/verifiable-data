import { contexts } from './contexts';
import * as ed25519 from '@transmute/did-key-ed25519';
import * as bls12381 from '@transmute/did-key-bls12381';

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

  console.error('documentLoader: ', iri);
  throw new Error('Unsupported iri ' + iri);
};
