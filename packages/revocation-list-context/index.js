const constants = require("./constants");

const contexts = new Map();

contexts.set(
  constants.REVOCATION_LIST_CONTEXT_V1_URL,
  require("./contexts/rev-v1.json")
);

module.exports = { constants, contexts };
