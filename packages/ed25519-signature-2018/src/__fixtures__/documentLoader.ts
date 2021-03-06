import {
  documentLoaderFactory,
  contexts,
} from '@transmute/jsonld-document-loader';

import { issuer_0 } from './issuer.json';

const golem = documentLoaderFactory.pluginFactory.build({
  contexts: {
    ...contexts.W3C_Decentralized_Identifiers,
    ...contexts.W3C_Verifiable_Credentials,
    ...contexts.W3ID_Security_Vocabulary,
  },
});

golem.addResolver({
  [issuer_0.id]: {
    resolve: (_did: string) => {
      return issuer_0 as any;
    },
  },
});

const documentLoader = golem.buildDocumentLoader();

export { documentLoader };
