import { constants, contexts } from "./index.js";

export const constants: {
  DID_CONTEXT_V1_URL: "https://www.w3.org/ns/did/v1";
  DID_CONTEXT_TRANSMUTE_V1_URL: "https://ns.did.ai/transmute/v1";
  DID_CONTEXT_TRANSMUTE_PGP_2021_V1_URL: "https://ns.did.ai/suites/pgp-2021/v1";
  DID_CONTEXT_TRANSMUTE_JWS_2020_V1_URL: "https://ns.did.ai/suites/jws-2020/v1";
  DID_CONTEXT_TRANSMUTE_SECP256K1_2020_V1_URL: "https://ns.did.ai/suites/secp256k1-2020/v1";
  DID_CONTEXT_TRANSMUTE_ED25519_2020_V1_URL: "https://ns.did.ai/suites/ed25519-2020/v1";
  DID_CONTEXT_TRANSMUTE_X25519_2020_V1_URL: "https://ns.did.ai/suites/x25519-2020/v1";
  DID_CONTEXT_TRANSMUTE_SECP256K1_2019_V1_URL: "https://ns.did.ai/suites/secp256k1-2019/v1";
  DID_CONTEXT_TRANSMUTE_ED25519_2018_V1_URL: "https://ns.did.ai/suites/ed25519-2018/v1";
  DID_CONTEXT_TRANSMUTE_X25519_2018_V1_URL: "https://ns.did.ai/suites/x25519-2018/v1";
};

export const contexts: {
  get: (iri: string) => object;
};
