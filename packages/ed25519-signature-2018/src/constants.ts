const { constants: securityConstants } = require('@transmute/security-context');

const constants = {
  // leave commented out, changing this will break compatability
  // with digital bazaar
  // SECURITY_CONTEXT_URL: 'https://w3id.org/security/v3',
  SECURITY_CONTEXT_URL: securityConstants.SECURITY_CONTEXT_V2_URL,
  SECURITY_CONTEXT_V1_URL: securityConstants.SECURITY_CONTEXT_V1_URL,
  SECURITY_CONTEXT_V2_URL: securityConstants.SECURITY_CONTEXT_V2_URL,
  SECURITY_PROOF_URL: 'https://w3id.org/security#proof',
  SECURITY_SIGNATURE_URL: 'https://w3id.org/security#signature',
};

export default constants;
