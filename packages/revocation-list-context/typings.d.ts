import { constants, contexts } from "./index.js";

export const constants: {
  REVOCATION_LIST_CONTEXT_V1_URL: "https://w3id.org/vc-revocation-list-2020/v1";
};

export const contexts: {
  get: (iri: string) => object;
};
