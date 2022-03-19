import { contexts } from './contexts';
import axios from 'axios';
import {
  didUrlToDid,
  findFirstSubResourceWithId,
} from '@transmute/jsonld-document-loader';
import { resolve } from '@transmute/did-key.js';
export const documentLoader = async (iri: string): Promise<any> => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  if (iri.startsWith('did:key:')) {
    const did = didUrlToDid(iri as any);
    const { didDocument } = await resolve(did, {
      accept: 'application/did+json',
    });
    return { document: findFirstSubResourceWithId(didDocument, iri as any) };
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
