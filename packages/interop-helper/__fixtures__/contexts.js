const did = require("@transmute/did-context");
const cred = require("@transmute/credentials-context");
const sec = require("@transmute/security-context");

const contexts = {
  [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_V1_URL
  ),
  [cred.constants.CREDENTIALS_CONTEXT_V1_URL]: cred.contexts.get(
    cred.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [sec.constants.ED25519_2018_v1_URL]: sec.contexts.get(
    sec.constants.ED25519_2018_v1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V2_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V1_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  ),
};

module.exports = { contexts };
