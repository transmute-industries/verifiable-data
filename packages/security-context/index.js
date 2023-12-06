const contexts = new Map();

const SECURITY_CONTEXT_V1_URL = "https://w3id.org/security/v1";
contexts.set(SECURITY_CONTEXT_V1_URL, require("./contexts/sec-v1.json"));

const SECURITY_CONTEXT_V2_URL = "https://w3id.org/security/v2";
contexts.set(SECURITY_CONTEXT_V2_URL, require("./contexts/sec-v2.json"));

const PGP_2021_V1_URL = "https://w3id.org/security/suites/pgp-2021/v1";
contexts.set(PGP_2021_V1_URL, require("./contexts/suites/pgp-2021-v1.json"));

const MULTIKEY_2021_V1_URL =
  "https://w3id.org/security/suites/multikey-2021/v1";
contexts.set(
  MULTIKEY_2021_V1_URL,
  require("./contexts/suites/multikey-2021-v1.json")
);

const JSON_WEB_SIGNATURE_2020_V1_URL =
  "https://w3id.org/security/suites/jws-2020/v1";
contexts.set(
  JSON_WEB_SIGNATURE_2020_V1_URL,
  require("./contexts/suites/jws-2020-v1.json")
);

const ED25519_2020_V1_URL = "https://w3id.org/security/suites/ed25519-2020/v1";
contexts.set(
  ED25519_2020_V1_URL,
  require("./contexts/suites/ed25519-2020-v1.json")
);

const X25519_2020_V1_URL = "https://w3id.org/security/suites/x25519-2020/v1";
contexts.set(
  X25519_2020_V1_URL,
  require("./contexts/suites/x25519-2020-v1.json")
);

const SECP256K1_2020_V1_URL =
  "https://w3id.org/security/suites/secp256k1-2020/v1";
contexts.set(
  SECP256K1_2020_V1_URL,
  require("./contexts/suites/secp256k1-2020-v1.json")
);

const SECP256k1_2019_v1_URL =
  "https://w3id.org/security/suites/secp256k1-2019/v1";
contexts.set(
  SECP256k1_2019_v1_URL,
  require("./contexts/suites/secp256k1-2019-v1.json")
);

const X25519_2019_v1_URL = "https://w3id.org/security/suites/x25519-2019/v1";
contexts.set(
  X25519_2019_v1_URL,
  require("./contexts/suites/x25519-2019-v1.json")
);

const ED25519_2018_v1_URL = "https://w3id.org/security/suites/ed25519-2018/v1";
contexts.set(
  ED25519_2018_v1_URL,
  require("./contexts/suites/ed25519-2018-v1.json")
);

const constants = {
  SECURITY_CONTEXT_V1_URL,
  SECURITY_CONTEXT_V2_URL,
  MULTIKEY_2021_V1_URL,
  PGP_2021_V1_URL,
  JSON_WEB_SIGNATURE_2020_V1_URL,
  ED25519_2020_V1_URL,
  X25519_2020_V1_URL,
  SECP256K1_2020_V1_URL,
  SECP256k1_2019_v1_URL,
  X25519_2019_v1_URL,
  ED25519_2018_v1_URL,
};

module.exports = { constants, contexts };
