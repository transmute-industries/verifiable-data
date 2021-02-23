import { constants, contexts } from "./index.js";

export const constants: {
  DID_CONTEXT_V1_URL: "https://www.w3.org/ns/did/v1";
};

export const contexts: {
  get: (iri: string) => object;
};
