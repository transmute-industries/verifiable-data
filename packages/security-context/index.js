const constants = require("./constants");

const contexts = new Map();

contexts.set(
  constants.SECURITY_CONTEXT_V1_URL,
  require("./contexts/sec-v1.json")
);

contexts.set(
  constants.SECURITY_CONTEXT_V2_URL,
  require("./contexts/sec-v2.json")
);

module.exports = { constants, contexts };
