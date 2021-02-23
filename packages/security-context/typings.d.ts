import { constants, contexts } from "./index.js";

export const constants: {
  SECURITY_CONTEXT_V1_URL: "https://w3id.org/security/v1";
  SECURITY_CONTEXT_V2_URL: "https://w3id.org/security/v2";
};

export const contexts: {
  get: (iri: string) => object;
};
