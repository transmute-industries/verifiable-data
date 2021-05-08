const constants = require("./constants");

const contexts = new Map();

contexts.set(constants.DID_CONTEXT_V1_URL, require("./contexts/did-v1.json"));
contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_V1_URL,
  require("./contexts/did-v1-transmute.json")
);

contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_PGP_2021_V1_URL,
  require("./contexts/pgp-2021-v1.json")
);

contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_JWS_2020_V1_URL,
  require("./contexts/jws-2020-v1.json")
);

contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_SECP256K1_2020_V1_URL,
  require("./contexts/secp256k1-2020-v1.json")
);

contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_BLS12381_2020_V1_URL,
  require("./contexts/bls12381-2020-v1.json")
);

contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_ED25519_2020_V1_URL,
  require("./contexts/ed25519-2020-v1.json")
);

contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_X25519_2020_V1_URL,
  require("./contexts/x25519-2020-v1.json")
);

contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_SECP256K1_2019_V1_URL,
  require("./contexts/secp256k1-2019-v1.json")
);

contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_ED25519_2018_V1_URL,
  require("./contexts/ed25519-2018-v1.json")
);

contexts.set(
  constants.DID_CONTEXT_TRANSMUTE_X25519_2018_V1_URL,
  require("./contexts/x25519-2018-v1.json")
);

module.exports = { constants, contexts };
