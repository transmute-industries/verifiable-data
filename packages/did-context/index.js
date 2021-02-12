const constants = require("./constants");

const contexts = new Map();

contexts.set(constants.DID_CONTEXT_V1_URL, require("./contexts/did-v1.json"));

module.exports = { constants, contexts };
