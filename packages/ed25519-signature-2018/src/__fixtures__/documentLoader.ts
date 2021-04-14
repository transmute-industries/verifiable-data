import {
  documentLoaderFactory,
  contexts
} from "@transmute/jsonld-document-loader";
import didContexts from '@transmute/did-context';
import { issuer_0 } from "./issuer.json";

const golem = documentLoaderFactory.pluginFactory.build({
  contexts: {
    ...contexts.W3C_Decentralized_Identifiers,
    ...contexts.W3C_Verifiable_Credentials,
    ...contexts.W3ID_Security_Vocabulary,
    [didContexts.constants
      .DID_CONTEXT_TRANSMUTE_V1_URL]: didContexts.contexts.get(
      didContexts.constants.DID_CONTEXT_TRANSMUTE_V1_URL,
    ),
  },
});

golem.addResolver({
  [issuer_0.id]: {
    resolve: (_did: string) => {
      return issuer_0 as any;
    }
  }
});

const documentLoader = golem.buildDocumentLoader();

export { documentLoader };
