const constants = require("./constants");

const contexts = new Map();

// https://w3id.org/security/v1

contexts.set(
  constants.SECURITY_CONTEXT_V1_URL,
  require("./contexts/sec-v1.json")
);

// https://w3id.org/security/v2

contexts.set(
  constants.SECURITY_CONTEXT_V2_URL,
  require("./contexts/sec-v2.json")
);

// https://w3id.org/security/suites/pgp-2021/v1

contexts.set(constants.PGP_2021_V1_URL, require("./contexts/pgp-2021-v1.json"));

// https://w3id.org/security/suites/jws-2020/v1

contexts.set(
  constants.JSON_WEB_SIGNATURE_2020_V1_URL,
  require("./contexts/jws-2020-v1.json")
);

// https://w3id.org/security/suites/ed25519-2020/v1

contexts.set(
  constants.ED25519_2020_V1_URL,
  require("./contexts/ed25519-2020-v1.json")
);

// https://w3id.org/security/suites/x25519-2020/v1

contexts.set(
  constants.X25519_2020_V1_URL,
  require("./contexts/x25519-2020-v1.json")
);

// https://w3id.org/security/suites/bls12381-2020/v1

contexts.set(
  constants.BLS12381_2020_V1_URL,
  require("./contexts/bls12381-2020-v1.json")
);

// https://w3id.org/security/suites/secp256k1-2020/v1

contexts.set(
  constants.SECP256K1_2020_V1_URL,
  require("./contexts/secp256k1-2020-v1.json")
);

// https://w3id.org/security/suites/secp256k1-2019/v1

contexts.set(
  constants.SECP256k1_2019_v1_URL,
  require("./contexts/secp256k1-2019-v1.json")
);

// https://w3id.org/security/suites/x25519-2019/v1

contexts.set(
  constants.X25519_2019_v1_URL,
  require("./contexts/x25519-2019-v1.json")
);

// https://w3id.org/security/suites/ed25519-2018/v1

contexts.set(
  constants.ED25519_2018_v1_URL,
  require("./contexts/ed25519-2018-v1.json")
);

module.exports = { constants, contexts };
