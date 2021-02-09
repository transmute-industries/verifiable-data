const constants = require("./constants");

const contexts = new Map();

contexts.set(
  constants.CREDENTIALS_CONTEXT_V1_URL,
  require("./contexts/credentials-v1.json")
);

module.exports = {
  constants,
  contexts,
};
