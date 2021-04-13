const constants = require("./constants");

const contexts = new Map();

contexts.set(constants.DID_CONTEXT_V1_URL, require("./contexts/did-v1.json"));
contexts.set(constants.DID_CONTEXT_TRANSMUTE_V1_URL, require("./contexts/did-v1-transmute.json"));

module.exports = { constants, contexts };
