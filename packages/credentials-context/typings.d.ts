import { constants, contexts } from "./index.js";

export const constants: {
  CREDENTIALS_CONTEXT_V1_URL;
  "https://www.w3.org/2018/credentials/v1";
};

export const contexts: {
  get: (iri: string) => object;
};
