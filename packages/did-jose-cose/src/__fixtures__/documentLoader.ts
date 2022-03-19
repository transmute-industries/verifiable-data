import { resolve } from "@transmute/did-key-web-crypto";

import {
  documentLoaderFactory,
  DidUrl,
  didUrlToDid,
} from "@transmute/jsonld-document-loader";

export const documentLoader = documentLoaderFactory.build({
  ["did:key"]: async (didUrl: DidUrl) => {
    const did = didUrlToDid(didUrl);
    const { didDocument } = await resolve(did, {
      accept: "application/did+json",
    });
    return didDocument;
  },
});
