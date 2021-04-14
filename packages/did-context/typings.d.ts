import { constants, contexts } from "./index.js";

export const constants: {
  DID_CONTEXT_V1_URL: 'https://www.w3.org/ns/did/v1';
  DID_CONTEXT_TRANSMUTE_V1_URL: 'https://ns.did.ai/transmute/v1';
};

export const contexts: {
  get: (iri: string) => object;
};
