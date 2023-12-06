import { constants, contexts } from "./index.js";

export const constants: {
  SECURITY_CONTEXT_V1_URL: "https://w3id.org/security/v1";
  SECURITY_CONTEXT_V2_URL: "https://w3id.org/security/v2";
  MULTIKEY_2021_V1_URL: "https://w3id.org/security/suites/multikey-2021/v1";
  PGP_2021_V1_URL: "https://w3id.org/security/suites/pgp-2021/v1";
  JSON_WEB_SIGNATURE_2020_V1_URL: "https://w3id.org/security/suites/jws-2020/v1";
  ED25519_2020_V1_URL: "https://w3id.org/security/suites/ed25519-2020/v1";
  X25519_2020_V1_URL: "https://w3id.org/security/suites/x25519-2020/v1";
  SECP256K1_2020_V1_URL: "https://w3id.org/security/suites/secp256k1-2020/v1";
  SECP256k1_2019_v1_URL: "https://w3id.org/security/suites/secp256k1-2019/v1";
  X25519_2019_v1_URL: "https://w3id.org/security/suites/x25519-2019/v1";
  ED25519_2018_v1_URL: "https://w3id.org/security/suites/ed25519-2018/v1";
};

export const contexts: {
  get: (iri: string) => object;
};
