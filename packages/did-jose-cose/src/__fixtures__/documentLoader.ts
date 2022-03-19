import { resolve } from '@transmute/did-key-web-crypto';

import {
  documentLoaderFactory,
  DidUrl,
} from '@transmute/jsonld-document-loader';

export const documentLoader = documentLoaderFactory.build({
  ['did:key']: async (didUrl: DidUrl) => {
    const { didDocument } = await resolve(
      // TODO: fix bug in regex for didUrlToDid
      // didUrlToDid(didUrl as any)
      (didUrl as any).split('#')[0],
      { accept: 'application/did+json' }
    );
    return didDocument;
  },
});
