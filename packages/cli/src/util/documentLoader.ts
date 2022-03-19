import { contexts } from './contexts';
import axios from 'axios';
import { findFirstSubResourceWithId } from '@transmute/jsonld-document-loader';

export const documentLoader = async (iri: string): Promise<any> => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  if (iri.startsWith('did:web:')) {
    const config: any = {
      headers: {
        Accept: 'application/json',
      },
    };
    const { data } = await axios.get(
      'https://api.did.actor/identifiers/' + iri,
      config
    );
    return { document: findFirstSubResourceWithId(data, iri as any) };
  }
  const message = 'Unsupported iri: ' + iri;
  console.error(message);
  throw new Error(message);
};
